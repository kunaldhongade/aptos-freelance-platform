module my_addrx::FreelanceMarketplace {
    use std::signer;
    use std::vector;
    use aptos_framework::coin;
    use aptos_framework::aptos_coin::{AptosCoin};
    use std::string::{String};

    // Error codes
    const ERR_JOB_NOT_FOUND: u64 = 0;
    const ERR_ALREADY_ASSIGNED: u64 = 1;
    const ERR_INVALID_FREELANCER: u64 = 2;
    const ERR_JOB_ALREADY_COMPLETED: u64 = 3;
    const ERR_UNAUTHORIZED_ACCESS: u64 = 4;
    const ERR_PAYMENT_FAILED: u64 = 5;

    const GLOBAL_JOBS_ADDRESS: address = @job_addrx;

    // Struct to represent a freelance job
    struct Job has key, store, copy, drop {
        job_id: u64,
        client: address,
        freelancer: address,
        description: String,
        payment_amount: u64,
        is_completed: bool,
        is_paid: bool,
        is_accepted: bool,
        job_deadline: u64,
        is_freelancer_assigned: bool,
    }

    // Resource holding all jobs on the platform
    struct JobsHolder has key, store {
        jobs: vector<Job>,
    }

    // Resource holding registered freelancers
    struct FreelancerRegistry has key, store {
        freelancers: vector<address>,
    }
    
    // Initialize JobsHolder and FreelancerRegistry
    public entry fun initialize_platform(admin: &signer) {
        assert!(!exists<JobsHolder>(GLOBAL_JOBS_ADDRESS), ERR_UNAUTHORIZED_ACCESS);
        move_to(admin, JobsHolder { jobs: vector::empty<Job>() });
        move_to(admin, FreelancerRegistry { freelancers: vector::empty<address>() });
    }

    // Register a freelancer
    public entry fun register_freelancer(freelancer: &signer) acquires FreelancerRegistry {
        let registry = borrow_global_mut<FreelancerRegistry>(GLOBAL_JOBS_ADDRESS);
        let freelancer_addr = signer::address_of(freelancer);

        if (!vector::contains(&registry.freelancers, &freelancer_addr)) {
            vector::push_back(&mut registry.freelancers, freelancer_addr);
        }
    }

    // Post a new job (payment_amount in APTOS)
    public entry fun post_job(
        client: &signer,
        job_id: u64,
        description: String,
        payment_amount: u64, // Payment is in microAPTOS (1 APT = 1_000_000 microAPTOS)
        job_deadline: u64,
    ) acquires JobsHolder {
        let jobs_holder = borrow_global_mut<JobsHolder>(GLOBAL_JOBS_ADDRESS);

        let new_job = Job {
            job_id: job_id,
            client: signer::address_of(client),
            freelancer: @0x0,
            description: description,
            payment_amount: payment_amount,
            is_completed: false,
            is_accepted: false,
            is_paid: false,
            job_deadline: job_deadline,
            is_freelancer_assigned: false,
        };

        vector::push_back(&mut jobs_holder.jobs, new_job);
    }

    // Accept a job
    public entry fun accept_job(
        freelancer: &signer,
        job_id: u64
    ) acquires JobsHolder, FreelancerRegistry {
        let freelancer_addr = signer::address_of(freelancer);
        let registry = borrow_global<FreelancerRegistry>(GLOBAL_JOBS_ADDRESS);
        assert!(vector::contains(&registry.freelancers, &freelancer_addr), ERR_INVALID_FREELANCER);

        let jobs_holder = borrow_global_mut<JobsHolder>(GLOBAL_JOBS_ADDRESS);
        let job_index = find_job_index(job_id, jobs_holder.jobs);

        let job_ref = vector::borrow_mut(&mut jobs_holder.jobs, job_index);
        assert!(!job_ref.is_freelancer_assigned, ERR_ALREADY_ASSIGNED);

        job_ref.freelancer = freelancer_addr;
        job_ref.is_accepted = true;
        job_ref.is_freelancer_assigned = true;
    }

    // Mark a job as completed
    public entry fun complete_job(
        freelancer: &signer,
        job_id: u64
    ) acquires JobsHolder {
        let jobs_holder = borrow_global_mut<JobsHolder>(GLOBAL_JOBS_ADDRESS);
        let job_index = find_job_index(job_id, jobs_holder.jobs);

        let job_ref = vector::borrow_mut(&mut jobs_holder.jobs, job_index);
        assert!(job_ref.freelancer == signer::address_of(freelancer), ERR_UNAUTHORIZED_ACCESS);
        assert!(!job_ref.is_completed, ERR_JOB_ALREADY_COMPLETED);

        job_ref.is_completed = true;
    }

    // Pay freelancer (using Aptos native token)
    public entry fun pay_freelancer(
        client: &signer,
        job_id: u64
    ) acquires JobsHolder {
        let jobs_holder = borrow_global_mut<JobsHolder>(GLOBAL_JOBS_ADDRESS);
        let job_index = find_job_index(job_id, jobs_holder.jobs);

        let job_ref = vector::borrow_mut(&mut jobs_holder.jobs, job_index);
        assert!(job_ref.client == signer::address_of(client), ERR_UNAUTHORIZED_ACCESS);
        assert!(job_ref.is_completed, ERR_JOB_ALREADY_COMPLETED);

        let freelancer_address = job_ref.freelancer;
        assert!(freelancer_address != @0x0, ERR_UNAUTHORIZED_ACCESS);

        // Ensure payment amount matches job requirements
        let payment_amount = job_ref.payment_amount;

        // Transfer Aptos tokens from client to freelancer
        coin::transfer<AptosCoin>(client, freelancer_address, payment_amount);
        job_ref.is_paid = true;
    }

    // Helper function to find a job by its ID
    fun find_job_index(job_id: u64, jobs: vector<Job>): u64 {
        let jobs_len = vector::length(&jobs);
        let i = 0;

        while (i < jobs_len) {
            let job = vector::borrow(&jobs, i);
            if (job.job_id == job_id) {
                return i
            };
            i = i + 1;
        };
        assert!(false, ERR_JOB_NOT_FOUND);
        return 0
    }

    // View all jobs
    #[view]
    public fun view_all_jobs(): vector<Job> acquires JobsHolder {
        let jobs_holder = borrow_global<JobsHolder>(GLOBAL_JOBS_ADDRESS);
        return jobs_holder.jobs
    }

    // View job details by job ID
    #[view]
    public fun view_job_by_id(job_id: u64): Job acquires JobsHolder {
        let jobs_holder = borrow_global<JobsHolder>(GLOBAL_JOBS_ADDRESS);
        let job_index = find_job_index(job_id, jobs_holder.jobs);
        
        return *vector::borrow(&jobs_holder.jobs, job_index)
    }

    // View jobs by a specific client
    #[view]
    public fun view_jobs_by_client(client: address): vector<Job> acquires JobsHolder {
        let jobs_holder = borrow_global<JobsHolder>(GLOBAL_JOBS_ADDRESS);
        let result = vector::empty<Job>();
        let i = 0;

        while (i < vector::length(&jobs_holder.jobs)) {
            let job = vector::borrow(&jobs_holder.jobs, i);
            if (job.client == client) {
                vector::push_back(&mut result, *job);
            };
            i = i + 1;
        };

        return result
    }

    // View jobs accepted by a freelancer
    #[view]
    public fun view_jobs_by_freelancer(freelancer: address): vector<Job> acquires JobsHolder {
        let jobs_holder = borrow_global<JobsHolder>(GLOBAL_JOBS_ADDRESS);
        let result = vector::empty<Job>();
        let i = 0;

        while (i < vector::length(&jobs_holder.jobs)) {
            let job = vector::borrow(&jobs_holder.jobs, i);
            if (job.freelancer == freelancer) {
                vector::push_back(&mut result, *job);
            };
            i = i + 1;
        };

        return result
    }
}

contract;

storage {
    counter: u64 = 0,
}

abi Counter {
    #[storage(read, write)]
    fn increment();

    #[storage(read, write)]
    fn decrement();

    #[storage(read)]
    fn count() -> u64;
}

impl Counter for Contract {
    #[storage(read, write)]
    fn increment() {
        let incremented = storage.counter.read() + 1;
        storage.counter.write(incremented);
    }

    #[storage(read, write)]
    fn decrement() {
        if storage.counter.read() > 0 {
            let incremented = storage.counter.read() - 1;
            storage.counter.write(incremented);
        }
    }

    #[storage(read)]
    fn count() -> u64 {
        return storage.counter.read();
    }
}

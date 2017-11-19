class MultivestError extends Error {
    constructor(code, message, params) {
        super(message);

        this.code = code;
        this.params = params;
    }
}

module.exports = MultivestError;

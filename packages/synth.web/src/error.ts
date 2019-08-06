export class WebMultivestError extends Error {

    public isWebMultivestError: boolean = true;

    constructor(public message: string, public status: number) {
        super(message);
    }
}

import { AxiosError } from 'axios';

interface RequestErrorOptions {
	message: string;
	title: string;
	error: string;
	status: number;
}

export default class RequestError extends Error {
	public title: string;
	public _message: string;
	public error: string;
	public status: number;
	constructor(opts: RequestErrorOptions) {
		super(opts.title);
		Object.setPrototypeOf(this, RequestError.prototype);
		this.title = opts.title;
		this._message = opts.message;
		this.status = opts.status;
		this.message = `[${this.status}] ${this.title}: ${this._message}`;
		this.error = opts.error;
	}

	getMessage() {
		return this._message;
	}

	toString() {
		return this.message;
	}

	static async fromResponse(response: Response) {
		const errorData = await response.json(); // Get error response
		return new RequestError({
			title: errorData?.title || 'No Error Title',
			message: errorData?.message || 'No Error Message',
			error: errorData?.error || 'No Error',
			status: response?.status || 500,
		});
	}

	static fromAxiosError(error: AxiosError) {
		const data = (error?.response?.data as any) ?? {};
		return new RequestError({
			title: data?.title || 'No Error Title',
			message: data?.message || 'No Error Message',
			error: data?.error || 'No Error',
			status: error.response?.status || 500,
		});
	}
}

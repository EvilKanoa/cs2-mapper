export class HTTPError extends Error {
	message: string;
	httpError: string;
	statusCode: number;

	constructor(message: string, httpError: string, statusCode: number) {
		super(message);
		this.name = 'HTTPError';
		this.message = message;
		this.httpError = httpError;
		this.statusCode = statusCode;
	}

	toString = () =>
		`[HTTP ${this.statusCode} ${this.httpError}] ${this.message}`;
}

interface ResponseLike<T> {
	json(): Promise<T>;
	status: number;
}

export const toJsonIfStatus =
	<T = any, R extends ResponseLike<T> = Response>(status: number) =>
	async (response: R): Promise<T> => {
		let jsonError: Error | undefined = undefined;
		const body = await response?.json().catch((err) => {
			jsonError = err;
			return undefined;
		});

		if (response?.status !== status) {
			throw new HTTPError(
				'response status is incorrect',
				(body as any)?.error?.message,
				response.status ?? 500,
			);
		} else if (jsonError != null) {
			throw jsonError;
		}

		return body!;
	};

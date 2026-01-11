
# notes 


# API
- POST login
  - param: username
  - param: password
  - returns: client_token
- POST logout
  - param: client_token
- GET albums
  - param: client_token
  - returns: list of album names
- GET album.image_names
  - param: client_token
  - param: album_name
  - returns: list of image names in album 
- GET image
  - param: client_token
  - param: album_name
  - param: image_name
  - param: size (tiny, small, medium, fullsize)
  - returns: image bytes
- GET log
  - param: client_token
  - param: log_type (ingest, backup, checkup, deploy)
  - returns: log text

```ts
class ClientToken {
	private username: string;
	private token: string;

	constructor(username: string) {
		this.username = username;
		this.token = crypto.randomUUID();
	}

	to_string(): string {
		return `${this.username}-${this.token}`;
	}

	static from_string(tokenStr: string): ClientToken | null {
		const parts = tokenStr.split("-");
		if (parts.length < 2) {
			return null;
		}
		const username = parts[0];
		const token = parts.slice(1).join("-");
		const clientToken = new ClientToken(username);
		clientToken.token = token;
		return clientToken;
	}
}

// what the server stores to validate a client
class ServerToken {
	private client_token: ClientToken;
	private ip_address: string;
	private date_issued: Date;
	static readonly expiration_duration_ms = 30 * 24 * 60 * 60 * 1000; // 30 days

	constructor(client_token: ClientToken, ip_address: string) {
		this.client_token = client_token;
		this.ip_address = ip_address;
		this.date_issued = new Date();
	}

	validate(client_token: ClientToken, ip_address: string): boolean {
		const now = new Date();
		if (now.getTime() - this.date_issued.getTime() > ServerToken.expiration_duration_ms) {
			return false;
		}
		if (this.ip_address !== ip_address) {
			return false;
		}
		if (this.client_token.to_string() !== client_token.to_string()) {
			return false;
		}
		return true;
	}

	get username(): string {
		return this.client_token.username;
	}
}


```
export class NepseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NepseError';
  }
}

export class NepseNetworkError extends NepseError {
  constructor(message: string) {
    super(message);
    this.name = 'NepseNetworkError';
  }
}

export class NepseInvalidClientRequest extends NepseError {
  constructor(message: string) {
    super(message);
    this.name = 'NepseInvalidClientRequest';
  }
}

export class NepseInvalidServerResponse extends NepseError {
  constructor(message: string) {
    super(message);
    this.name = 'NepseInvalidServerResponse';
  }
}

export class NepseTokenExpired extends NepseError {
  constructor(message: string) {
    super(message);
    this.name = 'NepseTokenExpired';
  }
}

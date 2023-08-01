export class User {
  constructor(
    public firstName: string,
    public lastName: string,
    public role: string,
    public email: string,
    public userId: string,
    public savedVacancies: [],
    private _token: string,
    public tokenExpirationDate: Date
  ) {}

  get token() {
    if (!this.tokenExpirationDate || new Date() > this.tokenExpirationDate) {
      return null;
    }

    return this._token;
  }
}

export class BaseRepository {
  constructor(protected readonly fetch: typeof $fetch) {}

  getToken() {
    const token = useToken().value;
    return `Bearer ${token}`;
  }
}

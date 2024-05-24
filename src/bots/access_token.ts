export class AuthAccessToken {
    private static instance: AuthAccessToken;
    // https://developers.cloudflare.com/kv/reference/how-kv-works/
    private kv: KVNamespace;

    private constructor(kv: KVNamespace) {
        this.kv = kv;
    }

    public static getInstance(kv: KVNamespace): AuthAccessToken {
        if (!AuthAccessToken.instance) {
            AuthAccessToken.instance = new AuthAccessToken(kv);
        }
        return AuthAccessToken.instance;
    }

    public async add(key: string, access_token: string, expires_ttl = 86400) {
        const token = await this.kv.get(key);
        if (!token) {
            //https://developers.cloudflare.com/kv/api/write-key-value-pairs/
            await this.put(key, access_token, expires_ttl)
        }
    }

    public async put(key: string, access_token: string, expires_ttl = 86400) {
        //https://developers.cloudflare.com/kv/api/write-key-value-pairs/
        if (expires_ttl <= 0) {
            await this.kv.put(key, access_token);
        } else {
            await this.kv.put(key, access_token, { expirationTtl: expires_ttl });
        }
    }

    public async get(key: string, cache_ttl = 0): Promise<string> {
        //https://developers.cloudflare.com/kv/api/read-key-value-pairs/#cachettl-parameter
        if (cache_ttl <= 0) {
            const token = await this.kv.get(key);
            if (!token) {
                return ""
            }
            return token
        }
        if (cache_ttl < 60) {
            cache_ttl = 60
        }
        const token = await this.kv.get(key, { cacheTtl: cache_ttl });
        return token;
    }

    public async remove(key: string) {
        await this.kv.delete(key);
    }
}
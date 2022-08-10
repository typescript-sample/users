export interface Statement {
    query: string;
    params?: any[];
  }
export class FollowRepository<ID> {
    constructor(
        public exec: (statements: Statement[], firstSuccess?: boolean, ctx?: any) => Promise<number>,
        public followingTable: string,
        public id: string,
        public following: string,
        public followerTable: string,
        public followerId: string,
        public follower: string,
        public infoTable: string,
        public infoId: string,
        public followerCount: string,
        public followingCount: string) {
        this.follow = this.follow.bind(this);
        this.unfollow = this.unfollow.bind(this);
    }
    follow(id: ID, target: ID): Promise<number> {

        const query1 = `insert into ${this.followingTable}(${this.id}, ${this.following}) values ($1, $2)`;
        const query2 = `insert into ${this.followerTable}(${this.followerId}, ${this.follower}) values ($1, $2)`;
        const query3 = `
            insert into ${this.infoTable}(${this.infoId},${this.followingCount}, ${this.followerCount})
            values ($1, 1, 0)
            on conflict (${this.infoId}) do update set ${this.followingCount} =   ${this.infoTable}.${this.followingCount} + 1`;
        const query4 = `
            insert into ${this.infoTable}(${this.infoId},${this.followingCount}, ${this.followerCount})
            values ($1, 0, 1)
            on conflict (${this.infoId}) do update set ${this.followerCount} = ${this.infoTable}.${this.followerCount} + 1`;
        return this.exec([
            {query: query1, params: [id, target]},
            {query: query2, params: [target, id]},
            {query: query3, params: [id]},
            {query: query4, params: [target]},
        ], true);
    }
    unfollow(id: ID, target: ID): Promise<number> {
        const query1 = `delete from ${this.followingTable} where ${this.id} = $1 and ${this.following}=$2`;
        const query2 = `delete from ${this.followerTable} where ${this.followerId} = $1 and ${this.follower}=$2`;
        const query3 = `
            update ${this.infoTable}
            set ${this.followingCount} = ${this.followingCount} -1
            where ${this.infoId} = $1`;
        const query4 = `
        update ${this.infoTable}
        set ${this.followerCount} =${this.followerCount} - 1
        where ${this.infoId} = $1`;
        return this.exec([
            {query: query1, params: [id,target]},
            {query: query2, params: [target,id]},
            {query: query3, params: [id]},
            {query: query4, params: [target]},
        ], true);
    }
}

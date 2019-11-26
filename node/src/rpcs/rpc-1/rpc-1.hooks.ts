// Don't remove this comment. It's needed to format import lines nicely.

export default {
    before: {
        all: [
            (request: any, result: any) => {
                request.params[0] *= 2;
            },
            (request: any, result: any) => {
                request.params[1] -= 2;
            }
        ],
        getUser: [
            (request: any, result: any) => {
                if (!request.headers.authentication || !request.request.user) {
                    throw new Error('Authorization Error!');
                }
                request.user = request.request.user;
                request.authenticated = true;
            }
        ]
    },

    after: {
        all: []
    },

    error: {
        all: []
    }
};

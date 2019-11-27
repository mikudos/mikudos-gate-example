import _ from 'lodash';
// Don't remove this comment. It's needed to format import lines nicely.

export default {
    before: {
        all: [
            (request: any) => {
                request.params[1] -= 2;
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

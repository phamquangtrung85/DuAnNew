import { withAuth } from "next-auth/middleware";

export default withAuth({
    pages: {
        signIn: "/"
    }
});

export const config = {
    matcher: [
        "/users/:path*",
        "/conversations/:path*",
    ]
}

//text git merge
//develop test
//master test
//develop test
//master test
//develop test
// step 1
// step 2
// step 3
// step 4
// step 5
// step 1
// step 1

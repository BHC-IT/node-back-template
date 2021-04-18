// import * as User from '@bhc/bhcauthsdk';
// const bhcAuth = new (User.bhcAuth)('dosismart-bridge', 'f15aA;5EA6Ge!a6fe:BE;4@a2', "localhost:9090"); // eslint-disable-line

// export default { auth: bhcAuth, user: User.User };

import axios from 'axios';
import * as jwt from 'jwt-simple';

let token : string | null = null;

export const error = (er : string) : never => {throw new Error(er)}

export const getToken = () : string => token ? token : error('could not get token');

export const refreshToken = async () => {
	const body = {
		client_id: process.env.AUTH_CLIENT_ID,
		client_secret: process.env.AUTH_CLIENT_SECRET,
		grant_type: "client_credentials",
	}
	console.log(body);
	try {
		const res = await axios.post(process.env.AUTH_URL + '/auth/login', body);
		token = res.data.access_token;
		const infoToken = jwt.decode(token, null, true);
		setTimeout(refreshToken, infoToken.expires - Date.now());
	} catch (e) {
		console.log(e);
		throw (e);
	}
}
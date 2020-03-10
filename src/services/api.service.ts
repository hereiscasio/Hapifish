import http from 'axios';

export const apiService =
{
	GET (api: string)
	{
		return http.get(api)
			.then(data => [data, undefined])
			.catch(error => Promise.resolve([undefined, error]));
	},

	POST (api: string, data: any, headers: {})
	{
		return http.post(api, data, { headers })
			.then(data => '').catch(error =>
			{
				return Promise.resolve(error);
			});
	}
};
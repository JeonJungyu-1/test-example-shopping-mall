import { http } from 'msw';

import response from '@/__mocks__/response';
import { apiRoutes } from '@/apiRoutes';

const API_DOMAIN = 'http://localhost:3000';

export const handlers = [
  ...[
    apiRoutes.profile,
    apiRoutes.users,
    apiRoutes.product,
    apiRoutes.categories,
    apiRoutes.couponList,
  ].map(path =>
    http.get(`${API_DOMAIN}${path}`, () => {
      return Response.json(response[path]);
    }),
  ),
  http.get(`${API_DOMAIN}${apiRoutes.products}`, ({ request }) => {
    const data = response[apiRoutes.products];
    const url = new URL(request.url);
    const offset = Number(url.searchParams.get('offset'));
    const limit = Number(url.searchParams.get('limit'));
    const products = data.products.filter(
      (_, index) => index >= offset && index < offset + limit,
    );

    return Response.json({
      products,
      lastPage: data.products.length <= offset + limit,
    });
  }),
  http.post(`${API_DOMAIN}${apiRoutes.users}`, async ({ request }) => {
    const body = await request.json();
    if (body.name === 'FAIL') {
      return new Response(null, { status: 500 });
    }

    return new Response(null, { status: 200 });
  }),
  http.post(`${API_DOMAIN}${apiRoutes.login}`, async ({ request }) => {
    const body = await request.json();
    if (body.email === 'FAIL@gmail.com') {
      return new Response(null, { status: 401 });
    }

    return Response.json({
      access_token: 'access_token',
    });
  }),
  http.post(`${API_DOMAIN}${apiRoutes.log}`, () => {
    return new Response(null, { status: 200 });
  }),
];

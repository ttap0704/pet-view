import { GetServerSidePropsContext } from 'next'
import { parse, serialize } from 'cookie'

const servername = "http://localhost:3080";
const localname = "http://localhost:3001";


async function setHeader(uri: string, no_content_type?: boolean) {
  const root_path = uri.split('/')[1];
  const children_path = uri.split('/')[2];
  const check_arr = ['manage', 'manager'];
  const excepted_path = ['login', 'join']
  const cookie_fetch = await fetch(localname + '/api/get-cookies', {
    method: 'POST',
    body: JSON.stringify({ type: 'a-token' })
  })
  console.log(cookie_fetch)
  const cookie_res: { pass: boolean, token: string } = await cookie_fetch.json();
  const cookie: string = cookie_res.token
  console.log(cookie_res)

  const header: { [key: string]: string } = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  if (no_content_type) {
    delete header['Content-Type'];
  }

  if (!excepted_path.includes(children_path) && check_arr.includes(root_path) && cookie) {
    header['Authorization'] = `a-token ${cookie}`;
  }

  return header;
}

function setToken(res: any, ctx?: GetServerSidePropsContext) {
  const three_month_later = new Date(new Date().setMonth(new Date().getMonth() + 3));

  if (typeof window !== 'undefined') {
    if (res.token) {
      document.cookie = `a-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`; // 만료 코드
      document.cookie = `a-token=${res.token}; expires=${three_month_later}; path=/`; // 업데이트 코드
    }
    if (res.new_token) {
      document.cookie = `a-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
      document.cookie = `a-token=${res.new_token}; expires=${three_month_later}; path=/`;
    }
  } else if (ctx) {
    if (res.new_token) {
      ctx.res.setHeader('Set-Cookie', serialize(`a-token=`, ';', {
        path: '/',
        expires: new Date()
      }))
      ctx.res.setHeader('Set-Cookie', serialize('a-token', `${res.new_token}`, {
        path: '/',
        expires: three_month_later
      }))
    }
  }
}


// Fetch POST
export const fetchPostApi = async function (uri: string, args: object) {
  let response = await fetch(servername + uri, {
    method: 'POST',
    headers: {
      ...await setHeader(uri)
    },
    body: JSON.stringify(args)
  });
  let responseJson = await response.json();
  const set_token = await fetch(localname + '/api/set-cookies', {
    method: 'POST',
    body: JSON.stringify(responseJson)
  })
  console.log(set_token, 'setToken')
  return responseJson;
};

// Fetch GET
export const fetchGetApi = async function (uri: string, ctx?: GetServerSidePropsContext) {
  const headers = { ...await setHeader(uri) };
  let response = await fetch(servername + uri, {
    method: 'GET',
    headers,
  });
  let responseJson = await response.json();
  const set_token = await fetch(localname + '/api/set-cookies', {
    method: 'POST',
    body: JSON.stringify(responseJson)
  })
  console.log(set_token, 'setToken')

  return responseJson;
};

// Fetch DELETE
export const fetchDeleteApi = async function (uri: string) {
  let response = await fetch(servername + uri, {
    method: 'DELETE'
  });
  return response.status;
};

// Fetch PATCH
export const fetchPatchApi = async function (uri: string, args: { target: string, value: string | number }) {
  let response = await fetch(servername + uri, {
    method: 'PATCH',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(args)
  });

  return response.status;
};

// Fetch POST FILES
export const fetchFileApi = async function (uri: string, args: FormData) {
  let response = await fetch(servername + uri, {
    method: 'POST',
    body: args
  });
  let responseJson = await response.json();
  return responseJson;
};

// 사업자 인증 API
export const fecthCheckBusiness = async function (args: object) {
  const uri = `https://api.odcloud.kr/api/nts-businessman/v1/status?serviceKey=${process.env.BUSINESS_KEY}`
  let response = await fetch(uri, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(args)
  });
  let responseJson = await response.json();
  return responseJson;
};
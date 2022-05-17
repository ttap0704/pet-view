
const servername = "http://localhost:3080";

function getCookie(type: string) {
  if (typeof window !== 'undefined') {
    const cookie: string = document.cookie;
    if (cookie.length > 0) {
      const cookie_split: string[] = cookie.split(';');
      const cookie_arr: { target: string; value: string }[] = cookie_split.map(item => {
        const splited: string[] = item.split('=');

        return {
          target: splited[0].trim(),
          value: splited[1].trim(),
        };
      });

      const res_item: number = cookie_arr.findIndex(item => {
        return item.target == type;
      });

      if (cookie_arr[res_item]) {
        return cookie_arr[res_item].value;
      } else {
        return null;
      }
    }
  }

  return null;
}

function setHeader(uri: string, no_content_type?: boolean) {
  const root_path = uri.split('/')[1];
  const children_path = uri.split('/')[2];
  const check_arr = ['manage', 'manager'];
  const excepted_path = ['login', 'join']
  const cookie: string | null = getCookie('a-token') ? getCookie('a-token') : null;

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

async function setToken(res: any) {
  const three_month_later = new Date(new Date().setMonth(new Date().getMonth() + 3));

  if (typeof window !== 'undefined') {
    const token = res.token ? res.token : res.new_token;
    if (token) {
      document.cookie = `a-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`; // 만료 코드
      document.cookie = `a-token=${token}; expires=${three_month_later}; path=/`; // 업데이트 코드
    }
  }
}

// Fetch POST
export const fetchPostApi = async function (uri: string, args: object) {
  let response = await fetch(servername + uri, {
    method: 'POST',
    headers: {
      ...setHeader(uri)
    },
    body: JSON.stringify(args)
  });
  let responseJson = await response.json();
  setToken(responseJson);
  if (responseJson.new_token) {
    let response1 = await fetch(servername + uri, {
      method: 'POST',
      headers: {
        ...setHeader(uri, false),
      },
      body: JSON.stringify(args)
    });
    let responseJson1 = await response1.json();
    return responseJson1
  } else {
    return responseJson;
  }
};

// Fetch GET
export const fetchGetApi = async function (uri: string) {
  let response = await fetch(servername + uri, {
    method: 'GET',
    headers: {
      ...setHeader(uri, false),
    },
  });
  let responseJson = await response.json();
  setToken(responseJson);
  if (responseJson.new_token) {
    let response1 = await fetch(servername + uri, {
      method: 'GET',
      headers: {
        ...setHeader(uri, false),
      },
    });
    let responseJson1 = await response1.json();
    return responseJson1
  } else {
    return responseJson;
  }
};

// Fetch DELETE
export const fetchDeleteApi = async function (uri: string) {
  let response = await fetch(servername + uri, {
    method: 'DELETE',
    headers: {
      ...setHeader(uri, false),
    },
  });
  return response.status;
};

// Fetch PATCH
export const fetchPatchApi = async function (uri: string, args: { target: string, value: string | number }) {
  let response = await fetch(servername + uri, {
    method: 'PATCH',
    headers: {
      ...setHeader(uri, false),
    },
    body: JSON.stringify(args)
  });

  if (await response.json()) {
    const responseJson = await response.json()
    setToken(responseJson);

    let response1 = await fetch(servername + uri, {
      method: 'PATCH',
      headers: {
        ...setHeader(uri, false),
      },
      body: JSON.stringify(args)
    });
    return response1.status
  } else {
    return response.status;
  }
};

// Fetch POST FILES
export const fetchFileApi = async function (uri: string, args: FormData) {
  let response = await fetch(servername + uri, {
    method: 'POST',
    body: args
  });
  let responseJson = await response.json();
  if (responseJson.new_token) {
    let response1 = await fetch(servername + uri, {
      method: 'POST',
      body: args
    });
    let responseJson1 = await response1.json();
    return responseJson1
  } else {
    return responseJson;
  }
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
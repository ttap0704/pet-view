// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { parse, serialize } from 'cookie'

type Data = {
  pass: boolean;
  token: string
}

interface CustomRequest extends NextApiRequest {
  type: string
}

export default function handler(
  req: CustomRequest,
  res: NextApiResponse<Data>
) {
  try {
    if (req.method === 'POST') {
      const type = req.body.type;
      let token = '';
      if (req.headers.cookie) {
        token = req.cookies[type]
      }

      console.log(document.cookie, req.headers, token, 'get-cookies')
      res.status(200).send({ pass: true, token: token })
    } else {
      res.status(200).send({ pass: false, token: '' })
    }
  } catch (err) {
    res.status(200).send({ pass: false, token: '' })
  }
}

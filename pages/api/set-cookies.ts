// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { parse, serialize } from 'cookie'

type Data = {
  pass: boolean
}

interface CustomRequest extends NextApiRequest {
  token?: string;
  new_token?: string
}

export default function handler(
  req: CustomRequest,
  res: NextApiResponse<Data>
) {
  try {
    if (req.method === 'POST') {
      const three_month_later = new Date(new Date().setMonth(new Date().getMonth() + 3));
      const body = JSON.parse(req.body)
      const token = body.token ? body.token : body.new_token
      if (token) {
        res.setHeader('Set-Cookie', serialize(`a-token=`, ';', {
          path: '/',
          expires: new Date()
        }))
        res.setHeader('Set-Cookie', serialize('a-token', `${token}`, {
          path: '/',
          expires: three_month_later
        }))
        res.status(200).send({ pass: true })
      } else {
        res.status(200).send({ pass: false })
      }

    } else {
      res.status(200).send({ pass: false })
    }
  } catch (err) {
    res.status(200).send({ pass: false })
  }
}

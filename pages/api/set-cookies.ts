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

      console.log(req.token, req.new_token, 'hihi')
      if (req.token) {
        res.setHeader('Set-Cookie', serialize(`a-token=`, ';', {
          path: '/',
          expires: new Date()
        }))
        res.setHeader('Set-Cookie', serialize('a-token', `${req.token}`, {
          path: '/',
          expires: three_month_later
        }))
      } else if (req.new_token) {
        res.setHeader('Set-Cookie', serialize(`a-token=`, ';', {
          path: '/',
          expires: new Date()
        }))
        res.setHeader('Set-Cookie', serialize('a-token', `${req.new_token}`, {
          path: '/',
          expires: three_month_later
        }))
      }

      res.status(200).send({ pass: true })
    } else {
      res.status(200).send({ pass: false })
    }
  } catch (err) {
    res.status(200).send({ pass: false })
  }
}

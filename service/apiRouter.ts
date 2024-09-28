


import express from 'express'
import { DBVertor } from './utils';
import { ResultSetHeader } from 'mysql2';

const apiRouter = express.Router()



apiRouter.post('/candidate/create', async (req, res) => {
  const { name, address, age, avatar, position } = req.body
  const  sql = 'INSERT INTO candidates (name, address, avatar, age, position) VALUES(?, ?, ?, ?, ?)';
  const params =[name, address, avatar, age]
  params.push(position || '')
  if (!(name && address && age && avatar)) {
    res.json({success: false, message: '参数不全'});
    console.log('请求入参不全')
    return
  }
  const dbVertor = await DBVertor()
  
  const [result] = await dbVertor.query<ResultSetHeader>(sql, params)
  res.json({success: true, data: result.insertId})
})


apiRouter.get('/candidate/:id', async (req, res) => {
  const { id } = req.params
  if (!id) {
    res.json({success: false, message: 'id不能为空'});
    console.log('id不能为空')
    return
  }
  const dbVertor = await DBVertor()
  
  const  sql = `SELECT * FROM candidates WHERE id = ${id}`;
  const [results] = await dbVertor.query<any[]>(sql)
  if (!results.length) {
    res.json({success: false, message: '查询结果为空'});
    return
  }
  res.json({success: true, data: results[0]})
})


 export default apiRouter;
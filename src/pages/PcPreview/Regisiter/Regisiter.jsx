import styles from './Regisiter.less'
import React, { useState, useEffect } from 'react'
import { Button, Input, message } from 'antd'
import { trackCount, trackWebPush } from '@/services/pcPreview'
import { pushMsgMap } from '../constants.js'

const Regisiter = ({ setRegisiterFromVisiable, type = 'home' }) => {
  const [name, setName] = useState(null)
  const [phone, setPhone] = useState(null)
  const [count, setCount] = useState(0)

  useEffect(() => {
    ;(async () => {
      const res = await trackCount()
      setCount(res?.data)
    })()
  }, [])

  const handleSubmit = async e => {
    if (!phone) {
      message.warning('手机号为必填，请填写后提交哦！')
      return
    }

    const { code, message: msg } = await trackWebPush({
      trackName: name || '',
      trackPhone: phone,
      trackSource: pushMsgMap[type],
    })

    if (msg === '手机号格式不正确，请检查') {
      message.warning('手机号输入有误，请重试！')
      return
    }

    message.success('提交成功，您的专属管家马上会与您取得联系，请稍后')

    setName(null)
    setPhone(null)
  }

  const handleClose = e => {
    setName(null)
    setPhone(null)
    setRegisiterFromVisiable(false)
  }
  return (
    <div className={styles.wrapper}>
      <div className={styles.widthLimit}>
        <img src="/img/regisiter_pic.png" alt="" className={styles.first_pic} />
        <div className={styles.textWrapper}>
          <img src="/img/regisiter_title.png" alt="" className={styles.title_pic} />
          <div className={styles.count}>
            目前已有
            {count}
            人获取免费报价
          </div>
        </div>
        <form className={styles.formWrapper} onSubmit={e => e.preventDefault()}>
          <div className={styles.group}>
            <div className={styles.title}>姓名</div>
            <div className={styles.input}>
              <Input type="text" placeholder="请输入您的姓名" value={name} onChange={e => setName(e.target.value)} />
            </div>
          </div>
          <div className={styles.group}>
            <div className={styles.title}>联系方式</div>
            <div className={styles.input}>
              <Input
                type="text"
                placeholder="请输入您的电话号码"
                value={phone}
                onChange={e => setPhone(e.target.value)}
              />
            </div>
          </div>
          <div>
            <Button className={styles.submitBtn} onClick={handleSubmit}>
              立即获取
            </Button>
          </div>
        </form>
      </div>
      <div className={styles.closeBtn} onClick={handleClose} />
    </div>
  )
}

export default Regisiter

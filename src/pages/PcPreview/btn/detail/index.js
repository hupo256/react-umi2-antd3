import styles from './index.less'

const BtnMore = ({ text = '更多案例', url = '/', solid = false, style }) => {
  if (solid) {
    return (
      <div className={styles.moreBtnSolid} style={style}>
        <a onClick={() => window.open(url, '页面预览')}>{text}</a>
      </div>
    )
  }
  return (
    <div className={styles.moreBtn} style={style}>
      <a onClick={() => window.open(url, '页面预览')}>{text}</a>
    </div>
  )
}
export default BtnMore

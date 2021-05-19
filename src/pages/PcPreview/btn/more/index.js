import styles from './index.module.scss'

const BtnMore = ({ text = '更多案例', url = '/', solid = false, style }) => {
  if (solid) {
    return (
      <div className={styles.moreBtnSolid} style={style}>
        <a href={url}>{text}</a>
      </div>
    )
  }
  return (
    <div className={styles.moreBtn} style={style}>
      <a href={url}>{text}</a>
    </div>
  )
}
export default BtnMore

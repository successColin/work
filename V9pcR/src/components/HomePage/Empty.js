import homepage from '@/assets/homepage.png';
import styles from './Empty.less';

const Empty = () => {
  return (
    <div className={`${styles.wrap} system__contentbkgd`}>
      <img src={homepage} />
      {/*<img src={homepagefst} />  fst*/}
    </div>
  );
};
export default Empty;

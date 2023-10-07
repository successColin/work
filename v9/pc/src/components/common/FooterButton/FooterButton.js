/*
 * @Author: Fus
 * @Date:   2019-06-18 17:30:00
 * @Last Modified by: ytx
 * @Last Modified time: 2022-03-22 16:33:29
 * @Desc: 底部按钮栏
 */
import { Button, Tooltip } from 'antd';
import { FormattedMessage } from 'react-intl';
import styles from './FooterButton.less';

const btnConfigs = [
  {
    type: 'primary', // 类型（primary/''）,
    text: <FormattedMessage id="global.save" />,
    onClick: () => {},
  },
];

const FooterButton = ({ btnConfigs = [] }) => {
  const btns = btnConfigs.map((item, index) => {
    const {
      type = '',
      text = 'global.save',
      onClick = () => {},
      loading = false,
      htmlIcon = '',
      labelIconColour = '',
      tooltipText = '',
    } = item;
    const className = type === 'default' ? 'defaultButtonStyle' : '';
    console.log(1111111, item);
    return (
      <Tooltip key={index} placement="top" title={tooltipText}>
        <Button
          style={labelIconColour ? { background: labelIconColour, border: 0 } : null}
          onClick={onClick}
          type={type}
          key={index}
          loading={loading}
          className={className}
        >
          {htmlIcon}
          <FormattedMessage id={text} />
        </Button>
      </Tooltip>
    );
  });
  return (
    <div
      className={`${styles.wrap} custom-footer-bar system__contentbkgd system__footer--boxShadow`}
    >
      {btns}
    </div>
  );
};
export default FooterButton;

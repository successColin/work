/*
 * @Author: Fus
 * @Date:   2020-03-16 13:55:44
 * @Desc: 富文本编辑器
 */
import { CButton } from '@/components/common/BasicWidgets';

import { Component } from 'react';

class ExportButton extends Component {
  state = {};

  componentDidMount() {
    console.log(this.props.eleObj);
  }

  exportWordFun = () => {
    let html = `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
            </head>
            <body>
              ${document.getElementById('export').outerHTML}
            </body>
            </html>`;
    let blob = new Blob([html], { type: 'application/msword' });
    let a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `TableExcel${+new Date()}`;
    a.click();
  };

  render() {
    return (
      <CButton
        style={{ position: 'absolute', right: '15px', top: '10px' }}
        onClick={this.exportWordFun}
        className="globalAddNewBtn"
      >
        <span className="custom-color iconUpload iconfont" style={{ marginRight: '5px' }} />
        导出world
      </CButton>
    );
  }
}

export default ExportButton;

/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
// 包路径
const package_NdefRecord = 'android.nfc.NdefRecord';
const package_NdefMessage = 'android.nfc.NdefMessage';
const package_TECH_DISCOVERED = 'android.nfc.action.TECH_DISCOVERED';
const package_Intent = 'android.content.Intent';
const package_Activity = 'android.app.Activity';
const package_PendingIntent = 'android.app.PendingIntent';
const package_IntentFilter = 'android.content.IntentFilter';
const package_NfcAdapter = 'android.nfc.NfcAdapter';
const package_Ndef = 'android.nfc.tech.Ndef';
const package_NdefFormatable = 'android.nfc.tech.NdefFormatable';
const package_Parcelable = 'android.os.Parcelable';
const package_String = 'java.lang.String';

let NfcAdapter;
let NdefRecord;
let NdefMessage;
const techListsArray = [
  ['android.nfc.tech.IsoDep'],
  ['android.nfc.tech.NfcA'],
  ['android.nfc.tech.NfcB'],
  ['android.nfc.tech.NfcF'],
  ['android.nfc.tech.Nfcf'],
  ['android.nfc.tech.NfcV'],
  ['android.nfc.tech.NdefFormatable'],
  ['android.nfc.tech.MifareClassi'],
  ['android.nfc.tech.MifareUltralight']
];

const byteArrayToHexString = function (inarray) { // converts byte arrays to string
  let i;
  let j;
  let inn;
  const hex = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];
  let out = '';

  for (j = 0; j < inarray.length; j += 1) {
    inn = inarray[j] & 0xff;
    i = (inn >>> 4) & 0x0f;
    out += hex[i];
    i = inn & 0x0f;
    out += hex[i];
  }
  return out;
};
function toast(content, duration = 1500) {
  uni.showToast({
    title: content,
    icon: 'none',
    duration
  });
}
class StaticNFC {
  constructor(config) {
    plus.globalEvent.removeEventListener('newintent');
    plus.globalEvent.removeEventListener('pause');
    plus.globalEvent.removeEventListener('resume');
    this.readResult = {};
    this.readyRead = false;
    this.readyWriteData = false;
    this.noNFC = true; // 不支持nfc功能
    this.$i18nMsg = config.$t;
    console.log(config.$t('inspection.lang-NFC-no'));
    this.listenNFCStatus();
    this.callback = config.callback;
    if (config.readNFC) this.readData();
    // else if(config.writeNFC) this.writeData()
    this.get();
  }

  listenNFCStatus() {
    const that = this;
    try {
      const main = plus.android.runtimeMainActivity();
      const Intent = plus.android.importClass('android.content.Intent');
      // const Activity = plus.android.importClass('android.app.Activity');
      const PendingIntent = plus.android.importClass('android.app.PendingIntent');
      const IntentFilter = plus.android.importClass('android.content.IntentFilter');
      NfcAdapter = plus.android.importClass('android.nfc.NfcAdapter');
      const nfcAdapter = NfcAdapter.getDefaultAdapter(main);
      if (nfcAdapter == null) {
        uni.showToast({
          title: that.$i18nMsg('inspection.lang-NFC-no'),
          icon: 'none'
        });
        this.noNFC = true;
        return;
      }
      if (nfcAdapter.isEnabled()) {
        this.noNFC = false;
      } else {
        uni.showToast({
          title: that.$i18nMsg('inspection.lang-NFC-open-first'),
          icon: 'none'
        });
        this.noNFC = true;
        return;
      }
      const intent = new Intent(main, main.getClass());
      intent.addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP);
      const pendingIntent = PendingIntent.getActivity(main, 0, intent, 0);
      const ndef = new IntentFilter('android.nfc.action.TECH_DISCOVERED');
      ndef.addDataType('*/*');
      const intentFiltersArray = [ndef];
      plus.globalEvent.addEventListener('newintent', () => {
        console.log('newintent running');
        // 轮询调用 NFC
        setTimeout(that.nfcRuning(), 1000);
      });
      plus.globalEvent.addEventListener('pause', () => {
        console.log('pause running');
        if (nfcAdapter) {
          // 关闭前台调度系统
          // 恢复默认状态
          nfcAdapter.disableForegroundDispatch(main);
        }
      });
      plus.globalEvent.addEventListener('resume', (e) => {
        console.log('resume running');
        if (nfcAdapter) {
          // 开启前台调度系统
          // 优于所有其他NFC
          nfcAdapter.enableForegroundDispatch(main,
            pendingIntent, intentFiltersArray, techListsArray);
        }
      });
      nfcAdapter.enableForegroundDispatch(main, pendingIntent, intentFiltersArray, techListsArray);
    } catch (e) {
      console.error(e);
    }
  }

  nfcRuning() {
    NdefRecord = plus.android.importClass('android.nfc.NdefRecord');
    NdefMessage = plus.android.importClass('android.nfc.NdefMessage');
    const main = plus.android.runtimeMainActivity();
    const intent = main.getIntent();
    const that = this;
    // eslint-disable-next-line camelcase
    if (package_TECH_DISCOVERED === intent.getAction()) {
      if (this.readyWriteData) {
        that.write(intent);
        this.readyWriteData = false;
      } else if (this.readyRead) {
        that.read(intent);
        this.readyRead = false;
      }
    }
  }

  write(intent) {
    try {
      toast(this.$i18nMsg('inspection.lang-NFC-no-move'));

      // eslint-disable-next-line no-undef
      const textBytes = plus.android.invoke(text, 'getBytes');
      // image/jpeg text/plain
      const textRecord = new NdefRecord(NdefRecord.TNF_MIME_MEDIA,
        plus.android.invoke('text/plain', 'getBytes'),
        plus.android.invoke('', 'getBytes'), textBytes);
      const message = new NdefMessage([textRecord]);
      const Ndef = plus.android.importClass('android.nfc.tech.Ndef');
      const NdefFormatable = plus.android.importClass('android.nfc.tech.NdefFormatable');
      const tag = intent.getParcelableExtra(NfcAdapter.EXTRA_TAG);
      const ndef = Ndef.get(tag);
      if (ndef != null) {
        // 待写入的数据长度
        const size = message.toByteArray().length;
        ndef.connect();
        if (!ndef.isWritable()) {
          toast(this.$i18nMsg('inspection.lang-NFC-no-enter'));
          return;
        }
        if (ndef.getMaxSize() < size) {
          toast(this.$i18nMsg('inspection.lang-NFC-file-excess'));
          return;
        }
        ndef.writeNdefMessage(message);
        toast(this.$i18nMsg('inspection.lang-NFC-enter-success'));
        return;
      // eslint-disable-next-line no-else-return
      } else {
        const format = NdefFormatable.get(tag);
        if (format != null) {
          try {
            format.connect();
            format.format(message);
            toast(this.$i18nMsg('inspection.lang-NFC-format-write'));
            return;
          } catch (e) {
            toast(this.$i18nMsg('inspection.lang-NFC-format-fail'));
            return;
          }
        } else {
          toast(this.$i18nMsg('inspection.lang-NFC-no-NDEF'));
          return;
        }
      }
    } catch (e) {
      toast(this.$i18nMsg('inspection.lang-NFC-enter-fail'));
    }
  }

  read(intent) {
    toast(this.$i18nMsg('inspection.lang-NFC-move-enter'), 10000);
    try {
      let tag = plus.android.importClass('android.nfc.Tag');
      let content = '';
      tag = intent.getParcelableExtra(NfcAdapter.EXTRA_TAG);
      // const bytesId  = intent.getByteArrayExtra(NfcAdapter.EXTRA_ID);
      const nfcId = byteArrayToHexString(tag.getId());
      content += `${this.$i18nMsg('inspection.lang-NFC-card-chart-id')}：${tag.getId()}<br/>`;
      content += `${this.$i18nMsg('inspection.lang-NFC-card-id')}：${byteArrayToHexString(tag.getId())}<br/>`;
      this.readResult.value = nfcId;
      toast(this.$i18nMsg('inspection.lang-NFC-read-success'));
      if (this.callback) this.callback.call(this, this.readResult);
      // var tagid = reverseTwo(byteArrayToHexString(tag.getId()));
      // content +="卡片16进制翻转ID："+tagid+"<br/>";
      // content +="卡片10进制卡号："+parseInt(tagid, 16)+"<br/>";
      console.log(content);
    } catch (e) {
      toast(e);
    }
  }

  writeData () {
    if (this.noNFC) {
      toast(this.$i18nMsg('inspection.lang-NFC-support-open'));
      return;
    }
    // 轮询条件
    this.readyWriteData = true;
    toast(this.$i18nMsg('inspection.lang-NFC-near'));
  }

  readData () {
    console.log(this.noNFC);
    if (this.noNFC) {
      toast(this.$i18nMsg('inspection.lang-NFC-support-open'));
      return;
    }
    // 轮询条件
    this.readyRead = true;
    toast(this.$i18nMsg('inspection.lang-NFC-near'));
  }

  get() {
  }
}
export default StaticNFC;

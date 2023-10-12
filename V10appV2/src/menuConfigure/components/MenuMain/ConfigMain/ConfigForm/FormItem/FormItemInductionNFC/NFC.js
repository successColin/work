// eslint-disable-next-line max-classes-per-file
class StaticAdapter {
  constructor() {
    this.clearAdapter();
  }

  init() {
    const { platform } = uni.getSystemInfoSync();
    const result = { code: 400, platform };
    if (platform === 'android') {
      const main = plus.android.runtimeMainActivity();

      this.NfcAdapter = plus.android.importClass('android.nfc.NfcAdapter');
      const nfcAdapter = this.NfcAdapter.getDefaultAdapter(main);

      if (nfcAdapter && nfcAdapter.isEnabled()) {
        result.code = 200;
        const PendingIntent = plus.android.importClass(
          'android.app.PendingIntent'
        );
        const IntentFilter = plus.android.importClass(
          'android.content.IntentFilter'
        );
        const Intent = plus.android.importClass('android.content.Intent');
        const intent = new Intent(main, main.getClass());
        intent.addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP);

        const pendingIntent = PendingIntent.getActivity(main, 0, intent, 0);
        const ndef = new IntentFilter('android.nfc.action.TECH_DISCOVERED');
        ndef.addDataType('*/*');
        const intentFiltersArray = [ndef];

        const techListsArray = [
          ['android.nfc.tech.IsoDep'],
          ['android.nfc.tech.NfcA'],
          ['android.nfc.tech.NfcB'],
          ['android.nfc.tech.NfcF'],
          ['android.nfc.tech.Nfcf'],
          ['android.nfc.tech.NfcV'],
          ['android.nfc.tech.NdefFormatable'],
          ['android.nfc.tech.MifareClassi'],
          ['android.nfc.tech.MifareUltralight'],
        ];
        nfcAdapter.enableForegroundDispatch(
          main,
          pendingIntent,
          intentFiltersArray,
          techListsArray
        );
        plus.globalEvent.addEventListener('pause', () => {
          if (nfcAdapter) {
            // 关闭前台调度系统恢复默认状态
            nfcAdapter.disableForegroundDispatch(main);
          }
        });
        plus.globalEvent.addEventListener('resume', (e) => {
          console.log('resume running');
          if (nfcAdapter) {
            // 开启前台调度系统 优于所有其他NFC
            nfcAdapter.enableForegroundDispatch(
              main,
              pendingIntent,
              intentFiltersArray,
              techListsArray
            );
          }
        });
      } else {
        result.code = 400;
      }
    }
    return result;
  }

  setListenerNewintent(info, type) {
    plus.globalEvent.removeEventListener('newintent');
    plus.globalEvent.addEventListener('newintent', (e) => {
      // 轮询调用 NFC
      console.log('newintent running');
      if (type === 'read') {
        try {
          const main = plus.android.runtimeMainActivity();
          const intent = main.getIntent();
          let tag = plus.android.importClass('android.nfc.Tag');
          tag = intent.getParcelableExtra(this.NfcAdapter.EXTRA_TAG);
          const nfcId = this.byteArrayToHexString(tag.getId());
          info.value = nfcId;
          console.log(info);
        } catch (erro) {
          console.log(erro);
        }
      } else if (type === 'write') {
        const NdefRecord = plus.android.importClass('android.nfc.NdefRecord');
        const { value } = info;
        const textBytes = plus.android.invoke(value, 'getBytes');
        const textRecord = new NdefRecord(
          NdefRecord.TNF_MIME_MEDIA,
          plus.android.invoke('text/plain', 'getBytes'),
          plus.android.invoke('', 'getBytes'),
          textBytes
        );
      }
    });
  }

  write(info) {
    this.setListenerNewintent(info, 'write');
  }

  read(info) {
    this.setListenerNewintent(info, 'read');
  }

  byteArrayToHexString(inarray) {
    let i;
    let j;
    let inn;
    const hex = [
      '0',
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      'A',
      'B',
      'C',
      'D',
      'E',
      'F',
    ];
    let out = '';

    for (j = 0; j < inarray.length; j += 1) {
      inn = inarray[j] & 0xff;
      i = (inn >>> 4) & 0x0f;
      out += hex[i];
      i = inn & 0x0f;
      out += hex[i];
    }
    return out;
  }

  clearAdapter() {
    plus.globalEvent.removeEventListener('newintent');
    plus.globalEvent.removeEventListener('pause');
    plus.globalEvent.removeEventListener('resume');
    this.NfcAdapter = null;
  }
}

class StaticNFC {
  constructor(config) {
    console.log('StaticNFC========================');
    if (!this.sataus) {
      this.adapter = new StaticAdapter();
      this.sataus = this.adapter.init();
    }
    this.config = {
      timeout: 30000, // 过期时间
      ...config,
    };
    this.init();
  }

  init() {
    if (this.sataus.code === 400) {
      return this.sataus;
    }
    this.nfcInfo = new Proxy(
      {
        tagId: this.config.tagId,
        value: '',
      },
      {
        set: (target, key, value) => {
          const result = { ...target };
          result[key] = value;
          if (key === 'value' && this.config.readCallback) {
            this.clear();
            this.config.readCallback.call(this, result);
          }
          return true;
        },
      }
    );
  }

  redNfc() {
    if (this.sataus.code === 400) {
      throw new Error(this.sataus);
    }

    this.clear();
    this.adapter.read(this.nfcInfo);
  }

  writeNfc() {
    if (this.sataus.code === 400) {
      throw new Error(this.sataus);
    }
    this.clear();
    console.log('writeNfc===============');
    this.adapter.write(this.nfcInfo);
  }

  clear() {
    if (this.timeOp) clearInterval(this.timeOp);
    let time = this.config.timeout / 1000;
    this.config.timeoutCallback.call(this, {
      time,
      tagId: this.config.tagId,
    });
    this.timeOp = setInterval(() => {
      time -= 1;
      this.config.timeoutCallback.call(this, {
        time,
        tagId: this.config.tagId,
      });
      if (time <= 0) {
        console.log(this.adapter);
        this.adapter.clearAdapter();
        this.adapter = null;
        this.sataus = null;
        clearInterval(this.timeOp);
      }
    }, 1000);
  }
}

export default StaticNFC;

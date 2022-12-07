/**
 * @name: message
 * @author: DELL
 * @date: 2022/1/13 15:55
 * @description：message
 * @update: 2022/1/13 15:55
 */

import { Message } from 'element-ui'

let messageInstance = null

const resetMessage = (options) => {
  if (messageInstance) {
    messageInstance.close()
  }
  messageInstance = Message(options)
  return messageInstance
}

['error', 'success', 'info', 'warning'].forEach(type => {
  resetMessage[type] = options => {
    if (typeof options == 'string') {
      options = {
        message: options
      }
    }
    options.type = type
    return resetMessage(options)
  }
})

export const message = resetMessage

import { notification } from 'ant-design-vue';
import { t } from './useI18n';
import { useMessage } from './useMessage';

export function processList(result: any, list: any, pageParam: any) {
  if (!result) {
    return;
  }
  const { page, content } = result;
  list.splice(0);
  content.forEach((line) => {
    list.push(line);
  });
  page.number = page.number + 1;
  Object.assign(pageParam, {}, page);
}

export function success(message: any, description: any) {
  notification.success({
    message: message,
    description: description,
    duration: 3,
  });
}

export function failed(title: any, content: any) {
  const { createErrorModal } = useMessage();
  createErrorModal({
    title: title || t('sys.api.errorTip'),
    content: content || t('sys.api.networkExceptionMsg'),
    // getContainer: () => document.body.querySelector(`.${prefixCls}`) || document.body,
  });
}

export function processListByLine(result: any, list: any, total: any) {
  if (!result) {
    return;
  }
  const { content, page } = result;
  list.splice(0);
  if (content) {
    content.forEach((line) => {
      list.push(line);
    });
  }
  total.value = Number(page.totalElements);
}

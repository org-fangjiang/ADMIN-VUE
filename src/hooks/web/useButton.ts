// 控制删除或恢复按钮的展示
export function deleteOrEnable(state: string) {
  if (state === '0') {
    return false;
  } else {
    return true;
  }
}

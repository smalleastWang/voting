
/**
 * @description: className join, CSS modules 同时使用两个class简化处理
 * @param {array} classNames cj(styles.className1,styles.className2)
 * @return {*}
 * @author: Carmineprince
 */
export function cj(...classNames: string[]) {
  return classNames.join(' ');
};
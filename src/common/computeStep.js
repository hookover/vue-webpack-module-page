export function computedStepData(begin_num, step_num, length) {
    begin_num = parseFloat(begin_num);
    step_num = parseFloat(step_num);
    length = parseFloat(length);
    return (begin_num * 2 + (length - 1 ) * step_num) / 2 * length
};

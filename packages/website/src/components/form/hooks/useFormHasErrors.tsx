import { FormInstance } from 'antd';

export const useFormHasErrors = <T extends object>(form: FormInstance<T>) => {
  return form.getFieldsError().some(({ errors }) => errors.length > 0);
};

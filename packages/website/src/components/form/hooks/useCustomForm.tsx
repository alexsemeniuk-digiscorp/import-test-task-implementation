import { Form, FormInstance } from 'antd';
import { NamePath } from 'antd/es/form/interface';
import { useCallback } from 'react';

import { AnyObject, ObjectKeys } from '@helpers/types';

export type ChangeHandler<T extends AnyObject, K extends ObjectKeys<T>> = (
  value: T[K],
) => void;

export type GetChangeHandler<T extends AnyObject> = (
  fieldName: ObjectKeys<T>,
) => ChangeHandler<T, ObjectKeys<T>>;

type ReturnType<T extends AnyObject> = [FormInstance<T>, GetChangeHandler<T>];

export const useCustomForm = <T extends AnyObject>(
  form?: FormInstance<T>,
): ReturnType<T> => {
  const [formInstance] = Form.useForm<T>(form);

  const { setFieldValue } = formInstance;

  const handleChange = useCallback<GetChangeHandler<T>>(
    (fieldName: NamePath) => {
      return (value) => setFieldValue(fieldName, value);
    },
    [setFieldValue],
  );

  return [formInstance, handleChange];
};

export type ProgressModelPending = {
  complete: false;
  total: number;
  current: number;
};

export type ProgressModelComplete<T> = {
  complete: true;
  result: T;
};

export type ProgressModel<T> = ProgressModelPending | ProgressModelComplete<T>;

export function isProgressModelComplete<T>(model: ProgressModel<T>): model is ProgressModelComplete<T> {
  return model.complete;
}

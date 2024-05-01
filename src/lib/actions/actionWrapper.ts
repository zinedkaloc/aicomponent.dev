import { ActionReturn } from "@/lib/actions/types";

export default async function actionWrapper<T>(action: ActionReturn<T>) {
  const result = await action;

  if (!result.success) {
    throw result.errors;
  }

  return result.data;
}

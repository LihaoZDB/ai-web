import { serverApi, type Response } from "..";
import type { CreatePayDto, ResultPay } from "@en/common/pay";

export const createPay = (data: CreatePayDto) =>
  serverApi.post("/pay/create", data) as Promise<Response<ResultPay>>;

export const getPayStatus = (outTradeNo: string) =>
  serverApi.get(`/pay/status/${outTradeNo}`) as Promise<
    Response<string | null>
  >;

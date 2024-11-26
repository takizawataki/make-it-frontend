/**
 * @overview API クライアントを提供する
 * HTTP 層のオペレーションの実装を定義する
 * API クライアントの実態を隠蔽する
 */

import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

export const api = {
  /**
   * HTTP Get リクエストを送信する
   *
   * @param url - リクエスト先の URL
   * @param config - Axios の設定
   * @returns T 型 Axios レスポンス
   */
  get: async <T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> => {
    return await axios.get<T>(url, config);
  },

  /**
   * HTTP Post リクエストを送信する
   *
   * @param url - リクエスト先の URL
   * @param data - リクエストボディ
   * @param config - Axios の設定
   * @returns T 型 Axios レスポンス
   */
  post: async <T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> => {
    return await axios.post<T>(url, data, config);
  },

  /**
   * HTTP Put リクエストを送信する
   *
   * @param url - リクエスト先の URL
   * @param data - リクエストボディ
   * @param config - Axios の設定
   * @returns T 型 Axios レスポンス
   */
  put: async <T>(url: string, data?: unknown, config?: AxiosRequestConfig) => {
    return await axios.put<T>(url, data, config);
  },

  /**
   * HTTP Delete リクエストを送信する
   *
   * @param url - リクエスト先の URL
   * @param config - Axios の設定
   * @returns T 型 Axios レスポンス
   */
  delete: async <T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> => {
    return await axios.delete<T>(url, config);
  },
};

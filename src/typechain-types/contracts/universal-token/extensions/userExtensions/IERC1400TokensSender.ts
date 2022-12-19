/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type { FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "../../../../common";

export interface IERC1400TokensSenderInterface extends utils.Interface {
  functions: {
    "canTransfer(bytes,bytes32,address,address,address,uint256,bytes,bytes)": FunctionFragment;
    "tokensToTransfer(bytes,bytes32,address,address,address,uint256,bytes,bytes)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic: "canTransfer" | "tokensToTransfer"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "canTransfer",
    values: [
      PromiseOrValue<BytesLike>,
      PromiseOrValue<BytesLike>,
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BytesLike>,
      PromiseOrValue<BytesLike>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "tokensToTransfer",
    values: [
      PromiseOrValue<BytesLike>,
      PromiseOrValue<BytesLike>,
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BytesLike>,
      PromiseOrValue<BytesLike>
    ]
  ): string;

  decodeFunctionResult(
    functionFragment: "canTransfer",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "tokensToTransfer",
    data: BytesLike
  ): Result;

  events: {};
}

export interface IERC1400TokensSender extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: IERC1400TokensSenderInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    canTransfer(
      payload: PromiseOrValue<BytesLike>,
      partition: PromiseOrValue<BytesLike>,
      operator: PromiseOrValue<string>,
      from: PromiseOrValue<string>,
      to: PromiseOrValue<string>,
      value: PromiseOrValue<BigNumberish>,
      data: PromiseOrValue<BytesLike>,
      operatorData: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    tokensToTransfer(
      payload: PromiseOrValue<BytesLike>,
      partition: PromiseOrValue<BytesLike>,
      operator: PromiseOrValue<string>,
      from: PromiseOrValue<string>,
      to: PromiseOrValue<string>,
      value: PromiseOrValue<BigNumberish>,
      data: PromiseOrValue<BytesLike>,
      operatorData: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  canTransfer(
    payload: PromiseOrValue<BytesLike>,
    partition: PromiseOrValue<BytesLike>,
    operator: PromiseOrValue<string>,
    from: PromiseOrValue<string>,
    to: PromiseOrValue<string>,
    value: PromiseOrValue<BigNumberish>,
    data: PromiseOrValue<BytesLike>,
    operatorData: PromiseOrValue<BytesLike>,
    overrides?: CallOverrides
  ): Promise<boolean>;

  tokensToTransfer(
    payload: PromiseOrValue<BytesLike>,
    partition: PromiseOrValue<BytesLike>,
    operator: PromiseOrValue<string>,
    from: PromiseOrValue<string>,
    to: PromiseOrValue<string>,
    value: PromiseOrValue<BigNumberish>,
    data: PromiseOrValue<BytesLike>,
    operatorData: PromiseOrValue<BytesLike>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    canTransfer(
      payload: PromiseOrValue<BytesLike>,
      partition: PromiseOrValue<BytesLike>,
      operator: PromiseOrValue<string>,
      from: PromiseOrValue<string>,
      to: PromiseOrValue<string>,
      value: PromiseOrValue<BigNumberish>,
      data: PromiseOrValue<BytesLike>,
      operatorData: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<boolean>;

    tokensToTransfer(
      payload: PromiseOrValue<BytesLike>,
      partition: PromiseOrValue<BytesLike>,
      operator: PromiseOrValue<string>,
      from: PromiseOrValue<string>,
      to: PromiseOrValue<string>,
      value: PromiseOrValue<BigNumberish>,
      data: PromiseOrValue<BytesLike>,
      operatorData: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {};

  estimateGas: {
    canTransfer(
      payload: PromiseOrValue<BytesLike>,
      partition: PromiseOrValue<BytesLike>,
      operator: PromiseOrValue<string>,
      from: PromiseOrValue<string>,
      to: PromiseOrValue<string>,
      value: PromiseOrValue<BigNumberish>,
      data: PromiseOrValue<BytesLike>,
      operatorData: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    tokensToTransfer(
      payload: PromiseOrValue<BytesLike>,
      partition: PromiseOrValue<BytesLike>,
      operator: PromiseOrValue<string>,
      from: PromiseOrValue<string>,
      to: PromiseOrValue<string>,
      value: PromiseOrValue<BigNumberish>,
      data: PromiseOrValue<BytesLike>,
      operatorData: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    canTransfer(
      payload: PromiseOrValue<BytesLike>,
      partition: PromiseOrValue<BytesLike>,
      operator: PromiseOrValue<string>,
      from: PromiseOrValue<string>,
      to: PromiseOrValue<string>,
      value: PromiseOrValue<BigNumberish>,
      data: PromiseOrValue<BytesLike>,
      operatorData: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    tokensToTransfer(
      payload: PromiseOrValue<BytesLike>,
      partition: PromiseOrValue<BytesLike>,
      operator: PromiseOrValue<string>,
      from: PromiseOrValue<string>,
      to: PromiseOrValue<string>,
      value: PromiseOrValue<BigNumberish>,
      data: PromiseOrValue<BytesLike>,
      operatorData: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}

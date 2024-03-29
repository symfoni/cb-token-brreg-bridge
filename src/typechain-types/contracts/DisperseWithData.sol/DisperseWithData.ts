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
  PayableOverrides,
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
} from "../../common";

export interface DisperseWithDataInterface extends utils.Interface {
  functions: {
    "getDataLength()": FunctionFragment;
    "disperseEtherWithData(address[],uint256[],bytes)": FunctionFragment;
    "disperseTokenSimple(address,address[],uint256[])": FunctionFragment;
    "disperseToken(address,address[],uint256[])": FunctionFragment;
    "disperseTokenWithDataSimple(address,address[],uint256[],bytes)": FunctionFragment;
    "disperseEther(address[],uint256[])": FunctionFragment;
    "disperseTokenWithData(address,address[],uint256[],bytes)": FunctionFragment;
    "data(uint256)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "getDataLength"
      | "disperseEtherWithData"
      | "disperseTokenSimple"
      | "disperseToken"
      | "disperseTokenWithDataSimple"
      | "disperseEther"
      | "disperseTokenWithData"
      | "data"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "getDataLength",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "disperseEtherWithData",
    values: [
      PromiseOrValue<string>[],
      PromiseOrValue<BigNumberish>[],
      PromiseOrValue<BytesLike>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "disperseTokenSimple",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>[],
      PromiseOrValue<BigNumberish>[]
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "disperseToken",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>[],
      PromiseOrValue<BigNumberish>[]
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "disperseTokenWithDataSimple",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>[],
      PromiseOrValue<BigNumberish>[],
      PromiseOrValue<BytesLike>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "disperseEther",
    values: [PromiseOrValue<string>[], PromiseOrValue<BigNumberish>[]]
  ): string;
  encodeFunctionData(
    functionFragment: "disperseTokenWithData",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>[],
      PromiseOrValue<BigNumberish>[],
      PromiseOrValue<BytesLike>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "data",
    values: [PromiseOrValue<BigNumberish>]
  ): string;

  decodeFunctionResult(
    functionFragment: "getDataLength",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "disperseEtherWithData",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "disperseTokenSimple",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "disperseToken",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "disperseTokenWithDataSimple",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "disperseEther",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "disperseTokenWithData",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "data", data: BytesLike): Result;

  events: {};
}

export interface DisperseWithData extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: DisperseWithDataInterface;

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
    getDataLength(overrides?: CallOverrides): Promise<[BigNumber]>;

    disperseEtherWithData(
      recipients: PromiseOrValue<string>[],
      values: PromiseOrValue<BigNumberish>[],
      _data: PromiseOrValue<BytesLike>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    disperseTokenSimple(
      token: PromiseOrValue<string>,
      recipients: PromiseOrValue<string>[],
      values: PromiseOrValue<BigNumberish>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    disperseToken(
      token: PromiseOrValue<string>,
      recipients: PromiseOrValue<string>[],
      values: PromiseOrValue<BigNumberish>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    disperseTokenWithDataSimple(
      token: PromiseOrValue<string>,
      recipients: PromiseOrValue<string>[],
      values: PromiseOrValue<BigNumberish>[],
      _data: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    disperseEther(
      recipients: PromiseOrValue<string>[],
      values: PromiseOrValue<BigNumberish>[],
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    disperseTokenWithData(
      token: PromiseOrValue<string>,
      recipients: PromiseOrValue<string>[],
      values: PromiseOrValue<BigNumberish>[],
      _data: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    data(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[string]>;
  };

  getDataLength(overrides?: CallOverrides): Promise<BigNumber>;

  disperseEtherWithData(
    recipients: PromiseOrValue<string>[],
    values: PromiseOrValue<BigNumberish>[],
    _data: PromiseOrValue<BytesLike>,
    overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  disperseTokenSimple(
    token: PromiseOrValue<string>,
    recipients: PromiseOrValue<string>[],
    values: PromiseOrValue<BigNumberish>[],
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  disperseToken(
    token: PromiseOrValue<string>,
    recipients: PromiseOrValue<string>[],
    values: PromiseOrValue<BigNumberish>[],
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  disperseTokenWithDataSimple(
    token: PromiseOrValue<string>,
    recipients: PromiseOrValue<string>[],
    values: PromiseOrValue<BigNumberish>[],
    _data: PromiseOrValue<BytesLike>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  disperseEther(
    recipients: PromiseOrValue<string>[],
    values: PromiseOrValue<BigNumberish>[],
    overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  disperseTokenWithData(
    token: PromiseOrValue<string>,
    recipients: PromiseOrValue<string>[],
    values: PromiseOrValue<BigNumberish>[],
    _data: PromiseOrValue<BytesLike>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  data(
    arg0: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<string>;

  callStatic: {
    getDataLength(overrides?: CallOverrides): Promise<BigNumber>;

    disperseEtherWithData(
      recipients: PromiseOrValue<string>[],
      values: PromiseOrValue<BigNumberish>[],
      _data: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<void>;

    disperseTokenSimple(
      token: PromiseOrValue<string>,
      recipients: PromiseOrValue<string>[],
      values: PromiseOrValue<BigNumberish>[],
      overrides?: CallOverrides
    ): Promise<void>;

    disperseToken(
      token: PromiseOrValue<string>,
      recipients: PromiseOrValue<string>[],
      values: PromiseOrValue<BigNumberish>[],
      overrides?: CallOverrides
    ): Promise<void>;

    disperseTokenWithDataSimple(
      token: PromiseOrValue<string>,
      recipients: PromiseOrValue<string>[],
      values: PromiseOrValue<BigNumberish>[],
      _data: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<void>;

    disperseEther(
      recipients: PromiseOrValue<string>[],
      values: PromiseOrValue<BigNumberish>[],
      overrides?: CallOverrides
    ): Promise<void>;

    disperseTokenWithData(
      token: PromiseOrValue<string>,
      recipients: PromiseOrValue<string>[],
      values: PromiseOrValue<BigNumberish>[],
      _data: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<void>;

    data(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<string>;
  };

  filters: {};

  estimateGas: {
    getDataLength(overrides?: CallOverrides): Promise<BigNumber>;

    disperseEtherWithData(
      recipients: PromiseOrValue<string>[],
      values: PromiseOrValue<BigNumberish>[],
      _data: PromiseOrValue<BytesLike>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    disperseTokenSimple(
      token: PromiseOrValue<string>,
      recipients: PromiseOrValue<string>[],
      values: PromiseOrValue<BigNumberish>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    disperseToken(
      token: PromiseOrValue<string>,
      recipients: PromiseOrValue<string>[],
      values: PromiseOrValue<BigNumberish>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    disperseTokenWithDataSimple(
      token: PromiseOrValue<string>,
      recipients: PromiseOrValue<string>[],
      values: PromiseOrValue<BigNumberish>[],
      _data: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    disperseEther(
      recipients: PromiseOrValue<string>[],
      values: PromiseOrValue<BigNumberish>[],
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    disperseTokenWithData(
      token: PromiseOrValue<string>,
      recipients: PromiseOrValue<string>[],
      values: PromiseOrValue<BigNumberish>[],
      _data: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    data(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    getDataLength(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    disperseEtherWithData(
      recipients: PromiseOrValue<string>[],
      values: PromiseOrValue<BigNumberish>[],
      _data: PromiseOrValue<BytesLike>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    disperseTokenSimple(
      token: PromiseOrValue<string>,
      recipients: PromiseOrValue<string>[],
      values: PromiseOrValue<BigNumberish>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    disperseToken(
      token: PromiseOrValue<string>,
      recipients: PromiseOrValue<string>[],
      values: PromiseOrValue<BigNumberish>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    disperseTokenWithDataSimple(
      token: PromiseOrValue<string>,
      recipients: PromiseOrValue<string>[],
      values: PromiseOrValue<BigNumberish>[],
      _data: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    disperseEther(
      recipients: PromiseOrValue<string>[],
      values: PromiseOrValue<BigNumberish>[],
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    disperseTokenWithData(
      token: PromiseOrValue<string>,
      recipients: PromiseOrValue<string>[],
      values: PromiseOrValue<BigNumberish>[],
      _data: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    data(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}

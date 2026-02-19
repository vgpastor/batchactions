
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model BatchactionsJob
 * 
 */
export type BatchactionsJob = $Result.DefaultSelection<Prisma.$BatchactionsJobPayload>
/**
 * Model BatchactionsRecord
 * 
 */
export type BatchactionsRecord = $Result.DefaultSelection<Prisma.$BatchactionsRecordPayload>
/**
 * Model BatchactionsBatch
 * 
 */
export type BatchactionsBatch = $Result.DefaultSelection<Prisma.$BatchactionsBatchPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more BatchactionsJobs
 * const batchactionsJobs = await prisma.batchactionsJob.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more BatchactionsJobs
   * const batchactionsJobs = await prisma.batchactionsJob.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.batchactionsJob`: Exposes CRUD operations for the **BatchactionsJob** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more BatchactionsJobs
    * const batchactionsJobs = await prisma.batchactionsJob.findMany()
    * ```
    */
  get batchactionsJob(): Prisma.BatchactionsJobDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.batchactionsRecord`: Exposes CRUD operations for the **BatchactionsRecord** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more BatchactionsRecords
    * const batchactionsRecords = await prisma.batchactionsRecord.findMany()
    * ```
    */
  get batchactionsRecord(): Prisma.BatchactionsRecordDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.batchactionsBatch`: Exposes CRUD operations for the **BatchactionsBatch** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more BatchactionsBatches
    * const batchactionsBatches = await prisma.batchactionsBatch.findMany()
    * ```
    */
  get batchactionsBatch(): Prisma.BatchactionsBatchDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.19.2
   * Query Engine version: c2990dca591cba766e3b7ef5d9e8a84796e47ab7
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    BatchactionsJob: 'BatchactionsJob',
    BatchactionsRecord: 'BatchactionsRecord',
    BatchactionsBatch: 'BatchactionsBatch'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "batchactionsJob" | "batchactionsRecord" | "batchactionsBatch"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      BatchactionsJob: {
        payload: Prisma.$BatchactionsJobPayload<ExtArgs>
        fields: Prisma.BatchactionsJobFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BatchactionsJobFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BatchactionsJobPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BatchactionsJobFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BatchactionsJobPayload>
          }
          findFirst: {
            args: Prisma.BatchactionsJobFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BatchactionsJobPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BatchactionsJobFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BatchactionsJobPayload>
          }
          findMany: {
            args: Prisma.BatchactionsJobFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BatchactionsJobPayload>[]
          }
          create: {
            args: Prisma.BatchactionsJobCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BatchactionsJobPayload>
          }
          createMany: {
            args: Prisma.BatchactionsJobCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.BatchactionsJobCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BatchactionsJobPayload>[]
          }
          delete: {
            args: Prisma.BatchactionsJobDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BatchactionsJobPayload>
          }
          update: {
            args: Prisma.BatchactionsJobUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BatchactionsJobPayload>
          }
          deleteMany: {
            args: Prisma.BatchactionsJobDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BatchactionsJobUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.BatchactionsJobUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BatchactionsJobPayload>[]
          }
          upsert: {
            args: Prisma.BatchactionsJobUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BatchactionsJobPayload>
          }
          aggregate: {
            args: Prisma.BatchactionsJobAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBatchactionsJob>
          }
          groupBy: {
            args: Prisma.BatchactionsJobGroupByArgs<ExtArgs>
            result: $Utils.Optional<BatchactionsJobGroupByOutputType>[]
          }
          count: {
            args: Prisma.BatchactionsJobCountArgs<ExtArgs>
            result: $Utils.Optional<BatchactionsJobCountAggregateOutputType> | number
          }
        }
      }
      BatchactionsRecord: {
        payload: Prisma.$BatchactionsRecordPayload<ExtArgs>
        fields: Prisma.BatchactionsRecordFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BatchactionsRecordFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BatchactionsRecordPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BatchactionsRecordFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BatchactionsRecordPayload>
          }
          findFirst: {
            args: Prisma.BatchactionsRecordFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BatchactionsRecordPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BatchactionsRecordFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BatchactionsRecordPayload>
          }
          findMany: {
            args: Prisma.BatchactionsRecordFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BatchactionsRecordPayload>[]
          }
          create: {
            args: Prisma.BatchactionsRecordCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BatchactionsRecordPayload>
          }
          createMany: {
            args: Prisma.BatchactionsRecordCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.BatchactionsRecordCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BatchactionsRecordPayload>[]
          }
          delete: {
            args: Prisma.BatchactionsRecordDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BatchactionsRecordPayload>
          }
          update: {
            args: Prisma.BatchactionsRecordUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BatchactionsRecordPayload>
          }
          deleteMany: {
            args: Prisma.BatchactionsRecordDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BatchactionsRecordUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.BatchactionsRecordUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BatchactionsRecordPayload>[]
          }
          upsert: {
            args: Prisma.BatchactionsRecordUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BatchactionsRecordPayload>
          }
          aggregate: {
            args: Prisma.BatchactionsRecordAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBatchactionsRecord>
          }
          groupBy: {
            args: Prisma.BatchactionsRecordGroupByArgs<ExtArgs>
            result: $Utils.Optional<BatchactionsRecordGroupByOutputType>[]
          }
          count: {
            args: Prisma.BatchactionsRecordCountArgs<ExtArgs>
            result: $Utils.Optional<BatchactionsRecordCountAggregateOutputType> | number
          }
        }
      }
      BatchactionsBatch: {
        payload: Prisma.$BatchactionsBatchPayload<ExtArgs>
        fields: Prisma.BatchactionsBatchFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BatchactionsBatchFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BatchactionsBatchPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BatchactionsBatchFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BatchactionsBatchPayload>
          }
          findFirst: {
            args: Prisma.BatchactionsBatchFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BatchactionsBatchPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BatchactionsBatchFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BatchactionsBatchPayload>
          }
          findMany: {
            args: Prisma.BatchactionsBatchFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BatchactionsBatchPayload>[]
          }
          create: {
            args: Prisma.BatchactionsBatchCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BatchactionsBatchPayload>
          }
          createMany: {
            args: Prisma.BatchactionsBatchCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.BatchactionsBatchCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BatchactionsBatchPayload>[]
          }
          delete: {
            args: Prisma.BatchactionsBatchDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BatchactionsBatchPayload>
          }
          update: {
            args: Prisma.BatchactionsBatchUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BatchactionsBatchPayload>
          }
          deleteMany: {
            args: Prisma.BatchactionsBatchDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BatchactionsBatchUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.BatchactionsBatchUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BatchactionsBatchPayload>[]
          }
          upsert: {
            args: Prisma.BatchactionsBatchUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BatchactionsBatchPayload>
          }
          aggregate: {
            args: Prisma.BatchactionsBatchAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBatchactionsBatch>
          }
          groupBy: {
            args: Prisma.BatchactionsBatchGroupByArgs<ExtArgs>
            result: $Utils.Optional<BatchactionsBatchGroupByOutputType>[]
          }
          count: {
            args: Prisma.BatchactionsBatchCountArgs<ExtArgs>
            result: $Utils.Optional<BatchactionsBatchCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    batchactionsJob?: BatchactionsJobOmit
    batchactionsRecord?: BatchactionsRecordOmit
    batchactionsBatch?: BatchactionsBatchOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */



  /**
   * Models
   */

  /**
   * Model BatchactionsJob
   */

  export type AggregateBatchactionsJob = {
    _count: BatchactionsJobCountAggregateOutputType | null
    _avg: BatchactionsJobAvgAggregateOutputType | null
    _sum: BatchactionsJobSumAggregateOutputType | null
    _min: BatchactionsJobMinAggregateOutputType | null
    _max: BatchactionsJobMaxAggregateOutputType | null
  }

  export type BatchactionsJobAvgAggregateOutputType = {
    totalRecords: number | null
    startedAt: number | null
    completedAt: number | null
  }

  export type BatchactionsJobSumAggregateOutputType = {
    totalRecords: number | null
    startedAt: bigint | null
    completedAt: bigint | null
  }

  export type BatchactionsJobMinAggregateOutputType = {
    id: string | null
    status: string | null
    config: string | null
    batches: string | null
    totalRecords: number | null
    startedAt: bigint | null
    completedAt: bigint | null
    distributed: boolean | null
  }

  export type BatchactionsJobMaxAggregateOutputType = {
    id: string | null
    status: string | null
    config: string | null
    batches: string | null
    totalRecords: number | null
    startedAt: bigint | null
    completedAt: bigint | null
    distributed: boolean | null
  }

  export type BatchactionsJobCountAggregateOutputType = {
    id: number
    status: number
    config: number
    batches: number
    totalRecords: number
    startedAt: number
    completedAt: number
    distributed: number
    _all: number
  }


  export type BatchactionsJobAvgAggregateInputType = {
    totalRecords?: true
    startedAt?: true
    completedAt?: true
  }

  export type BatchactionsJobSumAggregateInputType = {
    totalRecords?: true
    startedAt?: true
    completedAt?: true
  }

  export type BatchactionsJobMinAggregateInputType = {
    id?: true
    status?: true
    config?: true
    batches?: true
    totalRecords?: true
    startedAt?: true
    completedAt?: true
    distributed?: true
  }

  export type BatchactionsJobMaxAggregateInputType = {
    id?: true
    status?: true
    config?: true
    batches?: true
    totalRecords?: true
    startedAt?: true
    completedAt?: true
    distributed?: true
  }

  export type BatchactionsJobCountAggregateInputType = {
    id?: true
    status?: true
    config?: true
    batches?: true
    totalRecords?: true
    startedAt?: true
    completedAt?: true
    distributed?: true
    _all?: true
  }

  export type BatchactionsJobAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BatchactionsJob to aggregate.
     */
    where?: BatchactionsJobWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BatchactionsJobs to fetch.
     */
    orderBy?: BatchactionsJobOrderByWithRelationInput | BatchactionsJobOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BatchactionsJobWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BatchactionsJobs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BatchactionsJobs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned BatchactionsJobs
    **/
    _count?: true | BatchactionsJobCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: BatchactionsJobAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: BatchactionsJobSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BatchactionsJobMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BatchactionsJobMaxAggregateInputType
  }

  export type GetBatchactionsJobAggregateType<T extends BatchactionsJobAggregateArgs> = {
        [P in keyof T & keyof AggregateBatchactionsJob]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBatchactionsJob[P]>
      : GetScalarType<T[P], AggregateBatchactionsJob[P]>
  }




  export type BatchactionsJobGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BatchactionsJobWhereInput
    orderBy?: BatchactionsJobOrderByWithAggregationInput | BatchactionsJobOrderByWithAggregationInput[]
    by: BatchactionsJobScalarFieldEnum[] | BatchactionsJobScalarFieldEnum
    having?: BatchactionsJobScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BatchactionsJobCountAggregateInputType | true
    _avg?: BatchactionsJobAvgAggregateInputType
    _sum?: BatchactionsJobSumAggregateInputType
    _min?: BatchactionsJobMinAggregateInputType
    _max?: BatchactionsJobMaxAggregateInputType
  }

  export type BatchactionsJobGroupByOutputType = {
    id: string
    status: string
    config: string
    batches: string
    totalRecords: number
    startedAt: bigint | null
    completedAt: bigint | null
    distributed: boolean
    _count: BatchactionsJobCountAggregateOutputType | null
    _avg: BatchactionsJobAvgAggregateOutputType | null
    _sum: BatchactionsJobSumAggregateOutputType | null
    _min: BatchactionsJobMinAggregateOutputType | null
    _max: BatchactionsJobMaxAggregateOutputType | null
  }

  type GetBatchactionsJobGroupByPayload<T extends BatchactionsJobGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BatchactionsJobGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BatchactionsJobGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BatchactionsJobGroupByOutputType[P]>
            : GetScalarType<T[P], BatchactionsJobGroupByOutputType[P]>
        }
      >
    >


  export type BatchactionsJobSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    status?: boolean
    config?: boolean
    batches?: boolean
    totalRecords?: boolean
    startedAt?: boolean
    completedAt?: boolean
    distributed?: boolean
  }, ExtArgs["result"]["batchactionsJob"]>

  export type BatchactionsJobSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    status?: boolean
    config?: boolean
    batches?: boolean
    totalRecords?: boolean
    startedAt?: boolean
    completedAt?: boolean
    distributed?: boolean
  }, ExtArgs["result"]["batchactionsJob"]>

  export type BatchactionsJobSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    status?: boolean
    config?: boolean
    batches?: boolean
    totalRecords?: boolean
    startedAt?: boolean
    completedAt?: boolean
    distributed?: boolean
  }, ExtArgs["result"]["batchactionsJob"]>

  export type BatchactionsJobSelectScalar = {
    id?: boolean
    status?: boolean
    config?: boolean
    batches?: boolean
    totalRecords?: boolean
    startedAt?: boolean
    completedAt?: boolean
    distributed?: boolean
  }

  export type BatchactionsJobOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "status" | "config" | "batches" | "totalRecords" | "startedAt" | "completedAt" | "distributed", ExtArgs["result"]["batchactionsJob"]>

  export type $BatchactionsJobPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "BatchactionsJob"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      status: string
      config: string
      batches: string
      totalRecords: number
      startedAt: bigint | null
      completedAt: bigint | null
      distributed: boolean
    }, ExtArgs["result"]["batchactionsJob"]>
    composites: {}
  }

  type BatchactionsJobGetPayload<S extends boolean | null | undefined | BatchactionsJobDefaultArgs> = $Result.GetResult<Prisma.$BatchactionsJobPayload, S>

  type BatchactionsJobCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<BatchactionsJobFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: BatchactionsJobCountAggregateInputType | true
    }

  export interface BatchactionsJobDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['BatchactionsJob'], meta: { name: 'BatchactionsJob' } }
    /**
     * Find zero or one BatchactionsJob that matches the filter.
     * @param {BatchactionsJobFindUniqueArgs} args - Arguments to find a BatchactionsJob
     * @example
     * // Get one BatchactionsJob
     * const batchactionsJob = await prisma.batchactionsJob.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BatchactionsJobFindUniqueArgs>(args: SelectSubset<T, BatchactionsJobFindUniqueArgs<ExtArgs>>): Prisma__BatchactionsJobClient<$Result.GetResult<Prisma.$BatchactionsJobPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one BatchactionsJob that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {BatchactionsJobFindUniqueOrThrowArgs} args - Arguments to find a BatchactionsJob
     * @example
     * // Get one BatchactionsJob
     * const batchactionsJob = await prisma.batchactionsJob.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BatchactionsJobFindUniqueOrThrowArgs>(args: SelectSubset<T, BatchactionsJobFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BatchactionsJobClient<$Result.GetResult<Prisma.$BatchactionsJobPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first BatchactionsJob that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BatchactionsJobFindFirstArgs} args - Arguments to find a BatchactionsJob
     * @example
     * // Get one BatchactionsJob
     * const batchactionsJob = await prisma.batchactionsJob.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BatchactionsJobFindFirstArgs>(args?: SelectSubset<T, BatchactionsJobFindFirstArgs<ExtArgs>>): Prisma__BatchactionsJobClient<$Result.GetResult<Prisma.$BatchactionsJobPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first BatchactionsJob that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BatchactionsJobFindFirstOrThrowArgs} args - Arguments to find a BatchactionsJob
     * @example
     * // Get one BatchactionsJob
     * const batchactionsJob = await prisma.batchactionsJob.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BatchactionsJobFindFirstOrThrowArgs>(args?: SelectSubset<T, BatchactionsJobFindFirstOrThrowArgs<ExtArgs>>): Prisma__BatchactionsJobClient<$Result.GetResult<Prisma.$BatchactionsJobPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more BatchactionsJobs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BatchactionsJobFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all BatchactionsJobs
     * const batchactionsJobs = await prisma.batchactionsJob.findMany()
     * 
     * // Get first 10 BatchactionsJobs
     * const batchactionsJobs = await prisma.batchactionsJob.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const batchactionsJobWithIdOnly = await prisma.batchactionsJob.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends BatchactionsJobFindManyArgs>(args?: SelectSubset<T, BatchactionsJobFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BatchactionsJobPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a BatchactionsJob.
     * @param {BatchactionsJobCreateArgs} args - Arguments to create a BatchactionsJob.
     * @example
     * // Create one BatchactionsJob
     * const BatchactionsJob = await prisma.batchactionsJob.create({
     *   data: {
     *     // ... data to create a BatchactionsJob
     *   }
     * })
     * 
     */
    create<T extends BatchactionsJobCreateArgs>(args: SelectSubset<T, BatchactionsJobCreateArgs<ExtArgs>>): Prisma__BatchactionsJobClient<$Result.GetResult<Prisma.$BatchactionsJobPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many BatchactionsJobs.
     * @param {BatchactionsJobCreateManyArgs} args - Arguments to create many BatchactionsJobs.
     * @example
     * // Create many BatchactionsJobs
     * const batchactionsJob = await prisma.batchactionsJob.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BatchactionsJobCreateManyArgs>(args?: SelectSubset<T, BatchactionsJobCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many BatchactionsJobs and returns the data saved in the database.
     * @param {BatchactionsJobCreateManyAndReturnArgs} args - Arguments to create many BatchactionsJobs.
     * @example
     * // Create many BatchactionsJobs
     * const batchactionsJob = await prisma.batchactionsJob.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many BatchactionsJobs and only return the `id`
     * const batchactionsJobWithIdOnly = await prisma.batchactionsJob.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends BatchactionsJobCreateManyAndReturnArgs>(args?: SelectSubset<T, BatchactionsJobCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BatchactionsJobPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a BatchactionsJob.
     * @param {BatchactionsJobDeleteArgs} args - Arguments to delete one BatchactionsJob.
     * @example
     * // Delete one BatchactionsJob
     * const BatchactionsJob = await prisma.batchactionsJob.delete({
     *   where: {
     *     // ... filter to delete one BatchactionsJob
     *   }
     * })
     * 
     */
    delete<T extends BatchactionsJobDeleteArgs>(args: SelectSubset<T, BatchactionsJobDeleteArgs<ExtArgs>>): Prisma__BatchactionsJobClient<$Result.GetResult<Prisma.$BatchactionsJobPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one BatchactionsJob.
     * @param {BatchactionsJobUpdateArgs} args - Arguments to update one BatchactionsJob.
     * @example
     * // Update one BatchactionsJob
     * const batchactionsJob = await prisma.batchactionsJob.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BatchactionsJobUpdateArgs>(args: SelectSubset<T, BatchactionsJobUpdateArgs<ExtArgs>>): Prisma__BatchactionsJobClient<$Result.GetResult<Prisma.$BatchactionsJobPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more BatchactionsJobs.
     * @param {BatchactionsJobDeleteManyArgs} args - Arguments to filter BatchactionsJobs to delete.
     * @example
     * // Delete a few BatchactionsJobs
     * const { count } = await prisma.batchactionsJob.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BatchactionsJobDeleteManyArgs>(args?: SelectSubset<T, BatchactionsJobDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more BatchactionsJobs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BatchactionsJobUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many BatchactionsJobs
     * const batchactionsJob = await prisma.batchactionsJob.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BatchactionsJobUpdateManyArgs>(args: SelectSubset<T, BatchactionsJobUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more BatchactionsJobs and returns the data updated in the database.
     * @param {BatchactionsJobUpdateManyAndReturnArgs} args - Arguments to update many BatchactionsJobs.
     * @example
     * // Update many BatchactionsJobs
     * const batchactionsJob = await prisma.batchactionsJob.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more BatchactionsJobs and only return the `id`
     * const batchactionsJobWithIdOnly = await prisma.batchactionsJob.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends BatchactionsJobUpdateManyAndReturnArgs>(args: SelectSubset<T, BatchactionsJobUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BatchactionsJobPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one BatchactionsJob.
     * @param {BatchactionsJobUpsertArgs} args - Arguments to update or create a BatchactionsJob.
     * @example
     * // Update or create a BatchactionsJob
     * const batchactionsJob = await prisma.batchactionsJob.upsert({
     *   create: {
     *     // ... data to create a BatchactionsJob
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the BatchactionsJob we want to update
     *   }
     * })
     */
    upsert<T extends BatchactionsJobUpsertArgs>(args: SelectSubset<T, BatchactionsJobUpsertArgs<ExtArgs>>): Prisma__BatchactionsJobClient<$Result.GetResult<Prisma.$BatchactionsJobPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of BatchactionsJobs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BatchactionsJobCountArgs} args - Arguments to filter BatchactionsJobs to count.
     * @example
     * // Count the number of BatchactionsJobs
     * const count = await prisma.batchactionsJob.count({
     *   where: {
     *     // ... the filter for the BatchactionsJobs we want to count
     *   }
     * })
    **/
    count<T extends BatchactionsJobCountArgs>(
      args?: Subset<T, BatchactionsJobCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BatchactionsJobCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a BatchactionsJob.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BatchactionsJobAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends BatchactionsJobAggregateArgs>(args: Subset<T, BatchactionsJobAggregateArgs>): Prisma.PrismaPromise<GetBatchactionsJobAggregateType<T>>

    /**
     * Group by BatchactionsJob.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BatchactionsJobGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends BatchactionsJobGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BatchactionsJobGroupByArgs['orderBy'] }
        : { orderBy?: BatchactionsJobGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, BatchactionsJobGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBatchactionsJobGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the BatchactionsJob model
   */
  readonly fields: BatchactionsJobFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for BatchactionsJob.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BatchactionsJobClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the BatchactionsJob model
   */
  interface BatchactionsJobFieldRefs {
    readonly id: FieldRef<"BatchactionsJob", 'String'>
    readonly status: FieldRef<"BatchactionsJob", 'String'>
    readonly config: FieldRef<"BatchactionsJob", 'String'>
    readonly batches: FieldRef<"BatchactionsJob", 'String'>
    readonly totalRecords: FieldRef<"BatchactionsJob", 'Int'>
    readonly startedAt: FieldRef<"BatchactionsJob", 'BigInt'>
    readonly completedAt: FieldRef<"BatchactionsJob", 'BigInt'>
    readonly distributed: FieldRef<"BatchactionsJob", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * BatchactionsJob findUnique
   */
  export type BatchactionsJobFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BatchactionsJob
     */
    select?: BatchactionsJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BatchactionsJob
     */
    omit?: BatchactionsJobOmit<ExtArgs> | null
    /**
     * Filter, which BatchactionsJob to fetch.
     */
    where: BatchactionsJobWhereUniqueInput
  }

  /**
   * BatchactionsJob findUniqueOrThrow
   */
  export type BatchactionsJobFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BatchactionsJob
     */
    select?: BatchactionsJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BatchactionsJob
     */
    omit?: BatchactionsJobOmit<ExtArgs> | null
    /**
     * Filter, which BatchactionsJob to fetch.
     */
    where: BatchactionsJobWhereUniqueInput
  }

  /**
   * BatchactionsJob findFirst
   */
  export type BatchactionsJobFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BatchactionsJob
     */
    select?: BatchactionsJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BatchactionsJob
     */
    omit?: BatchactionsJobOmit<ExtArgs> | null
    /**
     * Filter, which BatchactionsJob to fetch.
     */
    where?: BatchactionsJobWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BatchactionsJobs to fetch.
     */
    orderBy?: BatchactionsJobOrderByWithRelationInput | BatchactionsJobOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BatchactionsJobs.
     */
    cursor?: BatchactionsJobWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BatchactionsJobs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BatchactionsJobs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BatchactionsJobs.
     */
    distinct?: BatchactionsJobScalarFieldEnum | BatchactionsJobScalarFieldEnum[]
  }

  /**
   * BatchactionsJob findFirstOrThrow
   */
  export type BatchactionsJobFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BatchactionsJob
     */
    select?: BatchactionsJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BatchactionsJob
     */
    omit?: BatchactionsJobOmit<ExtArgs> | null
    /**
     * Filter, which BatchactionsJob to fetch.
     */
    where?: BatchactionsJobWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BatchactionsJobs to fetch.
     */
    orderBy?: BatchactionsJobOrderByWithRelationInput | BatchactionsJobOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BatchactionsJobs.
     */
    cursor?: BatchactionsJobWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BatchactionsJobs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BatchactionsJobs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BatchactionsJobs.
     */
    distinct?: BatchactionsJobScalarFieldEnum | BatchactionsJobScalarFieldEnum[]
  }

  /**
   * BatchactionsJob findMany
   */
  export type BatchactionsJobFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BatchactionsJob
     */
    select?: BatchactionsJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BatchactionsJob
     */
    omit?: BatchactionsJobOmit<ExtArgs> | null
    /**
     * Filter, which BatchactionsJobs to fetch.
     */
    where?: BatchactionsJobWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BatchactionsJobs to fetch.
     */
    orderBy?: BatchactionsJobOrderByWithRelationInput | BatchactionsJobOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing BatchactionsJobs.
     */
    cursor?: BatchactionsJobWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BatchactionsJobs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BatchactionsJobs.
     */
    skip?: number
    distinct?: BatchactionsJobScalarFieldEnum | BatchactionsJobScalarFieldEnum[]
  }

  /**
   * BatchactionsJob create
   */
  export type BatchactionsJobCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BatchactionsJob
     */
    select?: BatchactionsJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BatchactionsJob
     */
    omit?: BatchactionsJobOmit<ExtArgs> | null
    /**
     * The data needed to create a BatchactionsJob.
     */
    data: XOR<BatchactionsJobCreateInput, BatchactionsJobUncheckedCreateInput>
  }

  /**
   * BatchactionsJob createMany
   */
  export type BatchactionsJobCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many BatchactionsJobs.
     */
    data: BatchactionsJobCreateManyInput | BatchactionsJobCreateManyInput[]
  }

  /**
   * BatchactionsJob createManyAndReturn
   */
  export type BatchactionsJobCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BatchactionsJob
     */
    select?: BatchactionsJobSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the BatchactionsJob
     */
    omit?: BatchactionsJobOmit<ExtArgs> | null
    /**
     * The data used to create many BatchactionsJobs.
     */
    data: BatchactionsJobCreateManyInput | BatchactionsJobCreateManyInput[]
  }

  /**
   * BatchactionsJob update
   */
  export type BatchactionsJobUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BatchactionsJob
     */
    select?: BatchactionsJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BatchactionsJob
     */
    omit?: BatchactionsJobOmit<ExtArgs> | null
    /**
     * The data needed to update a BatchactionsJob.
     */
    data: XOR<BatchactionsJobUpdateInput, BatchactionsJobUncheckedUpdateInput>
    /**
     * Choose, which BatchactionsJob to update.
     */
    where: BatchactionsJobWhereUniqueInput
  }

  /**
   * BatchactionsJob updateMany
   */
  export type BatchactionsJobUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update BatchactionsJobs.
     */
    data: XOR<BatchactionsJobUpdateManyMutationInput, BatchactionsJobUncheckedUpdateManyInput>
    /**
     * Filter which BatchactionsJobs to update
     */
    where?: BatchactionsJobWhereInput
    /**
     * Limit how many BatchactionsJobs to update.
     */
    limit?: number
  }

  /**
   * BatchactionsJob updateManyAndReturn
   */
  export type BatchactionsJobUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BatchactionsJob
     */
    select?: BatchactionsJobSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the BatchactionsJob
     */
    omit?: BatchactionsJobOmit<ExtArgs> | null
    /**
     * The data used to update BatchactionsJobs.
     */
    data: XOR<BatchactionsJobUpdateManyMutationInput, BatchactionsJobUncheckedUpdateManyInput>
    /**
     * Filter which BatchactionsJobs to update
     */
    where?: BatchactionsJobWhereInput
    /**
     * Limit how many BatchactionsJobs to update.
     */
    limit?: number
  }

  /**
   * BatchactionsJob upsert
   */
  export type BatchactionsJobUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BatchactionsJob
     */
    select?: BatchactionsJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BatchactionsJob
     */
    omit?: BatchactionsJobOmit<ExtArgs> | null
    /**
     * The filter to search for the BatchactionsJob to update in case it exists.
     */
    where: BatchactionsJobWhereUniqueInput
    /**
     * In case the BatchactionsJob found by the `where` argument doesn't exist, create a new BatchactionsJob with this data.
     */
    create: XOR<BatchactionsJobCreateInput, BatchactionsJobUncheckedCreateInput>
    /**
     * In case the BatchactionsJob was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BatchactionsJobUpdateInput, BatchactionsJobUncheckedUpdateInput>
  }

  /**
   * BatchactionsJob delete
   */
  export type BatchactionsJobDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BatchactionsJob
     */
    select?: BatchactionsJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BatchactionsJob
     */
    omit?: BatchactionsJobOmit<ExtArgs> | null
    /**
     * Filter which BatchactionsJob to delete.
     */
    where: BatchactionsJobWhereUniqueInput
  }

  /**
   * BatchactionsJob deleteMany
   */
  export type BatchactionsJobDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BatchactionsJobs to delete
     */
    where?: BatchactionsJobWhereInput
    /**
     * Limit how many BatchactionsJobs to delete.
     */
    limit?: number
  }

  /**
   * BatchactionsJob without action
   */
  export type BatchactionsJobDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BatchactionsJob
     */
    select?: BatchactionsJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BatchactionsJob
     */
    omit?: BatchactionsJobOmit<ExtArgs> | null
  }


  /**
   * Model BatchactionsRecord
   */

  export type AggregateBatchactionsRecord = {
    _count: BatchactionsRecordCountAggregateOutputType | null
    _avg: BatchactionsRecordAvgAggregateOutputType | null
    _sum: BatchactionsRecordSumAggregateOutputType | null
    _min: BatchactionsRecordMinAggregateOutputType | null
    _max: BatchactionsRecordMaxAggregateOutputType | null
  }

  export type BatchactionsRecordAvgAggregateOutputType = {
    id: number | null
    recordIndex: number | null
  }

  export type BatchactionsRecordSumAggregateOutputType = {
    id: number | null
    recordIndex: number | null
  }

  export type BatchactionsRecordMinAggregateOutputType = {
    id: number | null
    jobId: string | null
    batchId: string | null
    recordIndex: number | null
    status: string | null
    raw: string | null
    parsed: string | null
    errors: string | null
    processingError: string | null
  }

  export type BatchactionsRecordMaxAggregateOutputType = {
    id: number | null
    jobId: string | null
    batchId: string | null
    recordIndex: number | null
    status: string | null
    raw: string | null
    parsed: string | null
    errors: string | null
    processingError: string | null
  }

  export type BatchactionsRecordCountAggregateOutputType = {
    id: number
    jobId: number
    batchId: number
    recordIndex: number
    status: number
    raw: number
    parsed: number
    errors: number
    processingError: number
    _all: number
  }


  export type BatchactionsRecordAvgAggregateInputType = {
    id?: true
    recordIndex?: true
  }

  export type BatchactionsRecordSumAggregateInputType = {
    id?: true
    recordIndex?: true
  }

  export type BatchactionsRecordMinAggregateInputType = {
    id?: true
    jobId?: true
    batchId?: true
    recordIndex?: true
    status?: true
    raw?: true
    parsed?: true
    errors?: true
    processingError?: true
  }

  export type BatchactionsRecordMaxAggregateInputType = {
    id?: true
    jobId?: true
    batchId?: true
    recordIndex?: true
    status?: true
    raw?: true
    parsed?: true
    errors?: true
    processingError?: true
  }

  export type BatchactionsRecordCountAggregateInputType = {
    id?: true
    jobId?: true
    batchId?: true
    recordIndex?: true
    status?: true
    raw?: true
    parsed?: true
    errors?: true
    processingError?: true
    _all?: true
  }

  export type BatchactionsRecordAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BatchactionsRecord to aggregate.
     */
    where?: BatchactionsRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BatchactionsRecords to fetch.
     */
    orderBy?: BatchactionsRecordOrderByWithRelationInput | BatchactionsRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BatchactionsRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BatchactionsRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BatchactionsRecords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned BatchactionsRecords
    **/
    _count?: true | BatchactionsRecordCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: BatchactionsRecordAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: BatchactionsRecordSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BatchactionsRecordMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BatchactionsRecordMaxAggregateInputType
  }

  export type GetBatchactionsRecordAggregateType<T extends BatchactionsRecordAggregateArgs> = {
        [P in keyof T & keyof AggregateBatchactionsRecord]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBatchactionsRecord[P]>
      : GetScalarType<T[P], AggregateBatchactionsRecord[P]>
  }




  export type BatchactionsRecordGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BatchactionsRecordWhereInput
    orderBy?: BatchactionsRecordOrderByWithAggregationInput | BatchactionsRecordOrderByWithAggregationInput[]
    by: BatchactionsRecordScalarFieldEnum[] | BatchactionsRecordScalarFieldEnum
    having?: BatchactionsRecordScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BatchactionsRecordCountAggregateInputType | true
    _avg?: BatchactionsRecordAvgAggregateInputType
    _sum?: BatchactionsRecordSumAggregateInputType
    _min?: BatchactionsRecordMinAggregateInputType
    _max?: BatchactionsRecordMaxAggregateInputType
  }

  export type BatchactionsRecordGroupByOutputType = {
    id: number
    jobId: string
    batchId: string
    recordIndex: number
    status: string
    raw: string
    parsed: string
    errors: string
    processingError: string | null
    _count: BatchactionsRecordCountAggregateOutputType | null
    _avg: BatchactionsRecordAvgAggregateOutputType | null
    _sum: BatchactionsRecordSumAggregateOutputType | null
    _min: BatchactionsRecordMinAggregateOutputType | null
    _max: BatchactionsRecordMaxAggregateOutputType | null
  }

  type GetBatchactionsRecordGroupByPayload<T extends BatchactionsRecordGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BatchactionsRecordGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BatchactionsRecordGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BatchactionsRecordGroupByOutputType[P]>
            : GetScalarType<T[P], BatchactionsRecordGroupByOutputType[P]>
        }
      >
    >


  export type BatchactionsRecordSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    jobId?: boolean
    batchId?: boolean
    recordIndex?: boolean
    status?: boolean
    raw?: boolean
    parsed?: boolean
    errors?: boolean
    processingError?: boolean
  }, ExtArgs["result"]["batchactionsRecord"]>

  export type BatchactionsRecordSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    jobId?: boolean
    batchId?: boolean
    recordIndex?: boolean
    status?: boolean
    raw?: boolean
    parsed?: boolean
    errors?: boolean
    processingError?: boolean
  }, ExtArgs["result"]["batchactionsRecord"]>

  export type BatchactionsRecordSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    jobId?: boolean
    batchId?: boolean
    recordIndex?: boolean
    status?: boolean
    raw?: boolean
    parsed?: boolean
    errors?: boolean
    processingError?: boolean
  }, ExtArgs["result"]["batchactionsRecord"]>

  export type BatchactionsRecordSelectScalar = {
    id?: boolean
    jobId?: boolean
    batchId?: boolean
    recordIndex?: boolean
    status?: boolean
    raw?: boolean
    parsed?: boolean
    errors?: boolean
    processingError?: boolean
  }

  export type BatchactionsRecordOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "jobId" | "batchId" | "recordIndex" | "status" | "raw" | "parsed" | "errors" | "processingError", ExtArgs["result"]["batchactionsRecord"]>

  export type $BatchactionsRecordPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "BatchactionsRecord"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      jobId: string
      batchId: string
      recordIndex: number
      status: string
      raw: string
      parsed: string
      errors: string
      processingError: string | null
    }, ExtArgs["result"]["batchactionsRecord"]>
    composites: {}
  }

  type BatchactionsRecordGetPayload<S extends boolean | null | undefined | BatchactionsRecordDefaultArgs> = $Result.GetResult<Prisma.$BatchactionsRecordPayload, S>

  type BatchactionsRecordCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<BatchactionsRecordFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: BatchactionsRecordCountAggregateInputType | true
    }

  export interface BatchactionsRecordDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['BatchactionsRecord'], meta: { name: 'BatchactionsRecord' } }
    /**
     * Find zero or one BatchactionsRecord that matches the filter.
     * @param {BatchactionsRecordFindUniqueArgs} args - Arguments to find a BatchactionsRecord
     * @example
     * // Get one BatchactionsRecord
     * const batchactionsRecord = await prisma.batchactionsRecord.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BatchactionsRecordFindUniqueArgs>(args: SelectSubset<T, BatchactionsRecordFindUniqueArgs<ExtArgs>>): Prisma__BatchactionsRecordClient<$Result.GetResult<Prisma.$BatchactionsRecordPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one BatchactionsRecord that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {BatchactionsRecordFindUniqueOrThrowArgs} args - Arguments to find a BatchactionsRecord
     * @example
     * // Get one BatchactionsRecord
     * const batchactionsRecord = await prisma.batchactionsRecord.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BatchactionsRecordFindUniqueOrThrowArgs>(args: SelectSubset<T, BatchactionsRecordFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BatchactionsRecordClient<$Result.GetResult<Prisma.$BatchactionsRecordPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first BatchactionsRecord that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BatchactionsRecordFindFirstArgs} args - Arguments to find a BatchactionsRecord
     * @example
     * // Get one BatchactionsRecord
     * const batchactionsRecord = await prisma.batchactionsRecord.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BatchactionsRecordFindFirstArgs>(args?: SelectSubset<T, BatchactionsRecordFindFirstArgs<ExtArgs>>): Prisma__BatchactionsRecordClient<$Result.GetResult<Prisma.$BatchactionsRecordPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first BatchactionsRecord that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BatchactionsRecordFindFirstOrThrowArgs} args - Arguments to find a BatchactionsRecord
     * @example
     * // Get one BatchactionsRecord
     * const batchactionsRecord = await prisma.batchactionsRecord.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BatchactionsRecordFindFirstOrThrowArgs>(args?: SelectSubset<T, BatchactionsRecordFindFirstOrThrowArgs<ExtArgs>>): Prisma__BatchactionsRecordClient<$Result.GetResult<Prisma.$BatchactionsRecordPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more BatchactionsRecords that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BatchactionsRecordFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all BatchactionsRecords
     * const batchactionsRecords = await prisma.batchactionsRecord.findMany()
     * 
     * // Get first 10 BatchactionsRecords
     * const batchactionsRecords = await prisma.batchactionsRecord.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const batchactionsRecordWithIdOnly = await prisma.batchactionsRecord.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends BatchactionsRecordFindManyArgs>(args?: SelectSubset<T, BatchactionsRecordFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BatchactionsRecordPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a BatchactionsRecord.
     * @param {BatchactionsRecordCreateArgs} args - Arguments to create a BatchactionsRecord.
     * @example
     * // Create one BatchactionsRecord
     * const BatchactionsRecord = await prisma.batchactionsRecord.create({
     *   data: {
     *     // ... data to create a BatchactionsRecord
     *   }
     * })
     * 
     */
    create<T extends BatchactionsRecordCreateArgs>(args: SelectSubset<T, BatchactionsRecordCreateArgs<ExtArgs>>): Prisma__BatchactionsRecordClient<$Result.GetResult<Prisma.$BatchactionsRecordPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many BatchactionsRecords.
     * @param {BatchactionsRecordCreateManyArgs} args - Arguments to create many BatchactionsRecords.
     * @example
     * // Create many BatchactionsRecords
     * const batchactionsRecord = await prisma.batchactionsRecord.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BatchactionsRecordCreateManyArgs>(args?: SelectSubset<T, BatchactionsRecordCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many BatchactionsRecords and returns the data saved in the database.
     * @param {BatchactionsRecordCreateManyAndReturnArgs} args - Arguments to create many BatchactionsRecords.
     * @example
     * // Create many BatchactionsRecords
     * const batchactionsRecord = await prisma.batchactionsRecord.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many BatchactionsRecords and only return the `id`
     * const batchactionsRecordWithIdOnly = await prisma.batchactionsRecord.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends BatchactionsRecordCreateManyAndReturnArgs>(args?: SelectSubset<T, BatchactionsRecordCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BatchactionsRecordPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a BatchactionsRecord.
     * @param {BatchactionsRecordDeleteArgs} args - Arguments to delete one BatchactionsRecord.
     * @example
     * // Delete one BatchactionsRecord
     * const BatchactionsRecord = await prisma.batchactionsRecord.delete({
     *   where: {
     *     // ... filter to delete one BatchactionsRecord
     *   }
     * })
     * 
     */
    delete<T extends BatchactionsRecordDeleteArgs>(args: SelectSubset<T, BatchactionsRecordDeleteArgs<ExtArgs>>): Prisma__BatchactionsRecordClient<$Result.GetResult<Prisma.$BatchactionsRecordPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one BatchactionsRecord.
     * @param {BatchactionsRecordUpdateArgs} args - Arguments to update one BatchactionsRecord.
     * @example
     * // Update one BatchactionsRecord
     * const batchactionsRecord = await prisma.batchactionsRecord.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BatchactionsRecordUpdateArgs>(args: SelectSubset<T, BatchactionsRecordUpdateArgs<ExtArgs>>): Prisma__BatchactionsRecordClient<$Result.GetResult<Prisma.$BatchactionsRecordPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more BatchactionsRecords.
     * @param {BatchactionsRecordDeleteManyArgs} args - Arguments to filter BatchactionsRecords to delete.
     * @example
     * // Delete a few BatchactionsRecords
     * const { count } = await prisma.batchactionsRecord.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BatchactionsRecordDeleteManyArgs>(args?: SelectSubset<T, BatchactionsRecordDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more BatchactionsRecords.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BatchactionsRecordUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many BatchactionsRecords
     * const batchactionsRecord = await prisma.batchactionsRecord.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BatchactionsRecordUpdateManyArgs>(args: SelectSubset<T, BatchactionsRecordUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more BatchactionsRecords and returns the data updated in the database.
     * @param {BatchactionsRecordUpdateManyAndReturnArgs} args - Arguments to update many BatchactionsRecords.
     * @example
     * // Update many BatchactionsRecords
     * const batchactionsRecord = await prisma.batchactionsRecord.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more BatchactionsRecords and only return the `id`
     * const batchactionsRecordWithIdOnly = await prisma.batchactionsRecord.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends BatchactionsRecordUpdateManyAndReturnArgs>(args: SelectSubset<T, BatchactionsRecordUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BatchactionsRecordPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one BatchactionsRecord.
     * @param {BatchactionsRecordUpsertArgs} args - Arguments to update or create a BatchactionsRecord.
     * @example
     * // Update or create a BatchactionsRecord
     * const batchactionsRecord = await prisma.batchactionsRecord.upsert({
     *   create: {
     *     // ... data to create a BatchactionsRecord
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the BatchactionsRecord we want to update
     *   }
     * })
     */
    upsert<T extends BatchactionsRecordUpsertArgs>(args: SelectSubset<T, BatchactionsRecordUpsertArgs<ExtArgs>>): Prisma__BatchactionsRecordClient<$Result.GetResult<Prisma.$BatchactionsRecordPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of BatchactionsRecords.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BatchactionsRecordCountArgs} args - Arguments to filter BatchactionsRecords to count.
     * @example
     * // Count the number of BatchactionsRecords
     * const count = await prisma.batchactionsRecord.count({
     *   where: {
     *     // ... the filter for the BatchactionsRecords we want to count
     *   }
     * })
    **/
    count<T extends BatchactionsRecordCountArgs>(
      args?: Subset<T, BatchactionsRecordCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BatchactionsRecordCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a BatchactionsRecord.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BatchactionsRecordAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends BatchactionsRecordAggregateArgs>(args: Subset<T, BatchactionsRecordAggregateArgs>): Prisma.PrismaPromise<GetBatchactionsRecordAggregateType<T>>

    /**
     * Group by BatchactionsRecord.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BatchactionsRecordGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends BatchactionsRecordGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BatchactionsRecordGroupByArgs['orderBy'] }
        : { orderBy?: BatchactionsRecordGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, BatchactionsRecordGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBatchactionsRecordGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the BatchactionsRecord model
   */
  readonly fields: BatchactionsRecordFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for BatchactionsRecord.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BatchactionsRecordClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the BatchactionsRecord model
   */
  interface BatchactionsRecordFieldRefs {
    readonly id: FieldRef<"BatchactionsRecord", 'Int'>
    readonly jobId: FieldRef<"BatchactionsRecord", 'String'>
    readonly batchId: FieldRef<"BatchactionsRecord", 'String'>
    readonly recordIndex: FieldRef<"BatchactionsRecord", 'Int'>
    readonly status: FieldRef<"BatchactionsRecord", 'String'>
    readonly raw: FieldRef<"BatchactionsRecord", 'String'>
    readonly parsed: FieldRef<"BatchactionsRecord", 'String'>
    readonly errors: FieldRef<"BatchactionsRecord", 'String'>
    readonly processingError: FieldRef<"BatchactionsRecord", 'String'>
  }
    

  // Custom InputTypes
  /**
   * BatchactionsRecord findUnique
   */
  export type BatchactionsRecordFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BatchactionsRecord
     */
    select?: BatchactionsRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BatchactionsRecord
     */
    omit?: BatchactionsRecordOmit<ExtArgs> | null
    /**
     * Filter, which BatchactionsRecord to fetch.
     */
    where: BatchactionsRecordWhereUniqueInput
  }

  /**
   * BatchactionsRecord findUniqueOrThrow
   */
  export type BatchactionsRecordFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BatchactionsRecord
     */
    select?: BatchactionsRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BatchactionsRecord
     */
    omit?: BatchactionsRecordOmit<ExtArgs> | null
    /**
     * Filter, which BatchactionsRecord to fetch.
     */
    where: BatchactionsRecordWhereUniqueInput
  }

  /**
   * BatchactionsRecord findFirst
   */
  export type BatchactionsRecordFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BatchactionsRecord
     */
    select?: BatchactionsRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BatchactionsRecord
     */
    omit?: BatchactionsRecordOmit<ExtArgs> | null
    /**
     * Filter, which BatchactionsRecord to fetch.
     */
    where?: BatchactionsRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BatchactionsRecords to fetch.
     */
    orderBy?: BatchactionsRecordOrderByWithRelationInput | BatchactionsRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BatchactionsRecords.
     */
    cursor?: BatchactionsRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BatchactionsRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BatchactionsRecords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BatchactionsRecords.
     */
    distinct?: BatchactionsRecordScalarFieldEnum | BatchactionsRecordScalarFieldEnum[]
  }

  /**
   * BatchactionsRecord findFirstOrThrow
   */
  export type BatchactionsRecordFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BatchactionsRecord
     */
    select?: BatchactionsRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BatchactionsRecord
     */
    omit?: BatchactionsRecordOmit<ExtArgs> | null
    /**
     * Filter, which BatchactionsRecord to fetch.
     */
    where?: BatchactionsRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BatchactionsRecords to fetch.
     */
    orderBy?: BatchactionsRecordOrderByWithRelationInput | BatchactionsRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BatchactionsRecords.
     */
    cursor?: BatchactionsRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BatchactionsRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BatchactionsRecords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BatchactionsRecords.
     */
    distinct?: BatchactionsRecordScalarFieldEnum | BatchactionsRecordScalarFieldEnum[]
  }

  /**
   * BatchactionsRecord findMany
   */
  export type BatchactionsRecordFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BatchactionsRecord
     */
    select?: BatchactionsRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BatchactionsRecord
     */
    omit?: BatchactionsRecordOmit<ExtArgs> | null
    /**
     * Filter, which BatchactionsRecords to fetch.
     */
    where?: BatchactionsRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BatchactionsRecords to fetch.
     */
    orderBy?: BatchactionsRecordOrderByWithRelationInput | BatchactionsRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing BatchactionsRecords.
     */
    cursor?: BatchactionsRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BatchactionsRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BatchactionsRecords.
     */
    skip?: number
    distinct?: BatchactionsRecordScalarFieldEnum | BatchactionsRecordScalarFieldEnum[]
  }

  /**
   * BatchactionsRecord create
   */
  export type BatchactionsRecordCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BatchactionsRecord
     */
    select?: BatchactionsRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BatchactionsRecord
     */
    omit?: BatchactionsRecordOmit<ExtArgs> | null
    /**
     * The data needed to create a BatchactionsRecord.
     */
    data: XOR<BatchactionsRecordCreateInput, BatchactionsRecordUncheckedCreateInput>
  }

  /**
   * BatchactionsRecord createMany
   */
  export type BatchactionsRecordCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many BatchactionsRecords.
     */
    data: BatchactionsRecordCreateManyInput | BatchactionsRecordCreateManyInput[]
  }

  /**
   * BatchactionsRecord createManyAndReturn
   */
  export type BatchactionsRecordCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BatchactionsRecord
     */
    select?: BatchactionsRecordSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the BatchactionsRecord
     */
    omit?: BatchactionsRecordOmit<ExtArgs> | null
    /**
     * The data used to create many BatchactionsRecords.
     */
    data: BatchactionsRecordCreateManyInput | BatchactionsRecordCreateManyInput[]
  }

  /**
   * BatchactionsRecord update
   */
  export type BatchactionsRecordUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BatchactionsRecord
     */
    select?: BatchactionsRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BatchactionsRecord
     */
    omit?: BatchactionsRecordOmit<ExtArgs> | null
    /**
     * The data needed to update a BatchactionsRecord.
     */
    data: XOR<BatchactionsRecordUpdateInput, BatchactionsRecordUncheckedUpdateInput>
    /**
     * Choose, which BatchactionsRecord to update.
     */
    where: BatchactionsRecordWhereUniqueInput
  }

  /**
   * BatchactionsRecord updateMany
   */
  export type BatchactionsRecordUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update BatchactionsRecords.
     */
    data: XOR<BatchactionsRecordUpdateManyMutationInput, BatchactionsRecordUncheckedUpdateManyInput>
    /**
     * Filter which BatchactionsRecords to update
     */
    where?: BatchactionsRecordWhereInput
    /**
     * Limit how many BatchactionsRecords to update.
     */
    limit?: number
  }

  /**
   * BatchactionsRecord updateManyAndReturn
   */
  export type BatchactionsRecordUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BatchactionsRecord
     */
    select?: BatchactionsRecordSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the BatchactionsRecord
     */
    omit?: BatchactionsRecordOmit<ExtArgs> | null
    /**
     * The data used to update BatchactionsRecords.
     */
    data: XOR<BatchactionsRecordUpdateManyMutationInput, BatchactionsRecordUncheckedUpdateManyInput>
    /**
     * Filter which BatchactionsRecords to update
     */
    where?: BatchactionsRecordWhereInput
    /**
     * Limit how many BatchactionsRecords to update.
     */
    limit?: number
  }

  /**
   * BatchactionsRecord upsert
   */
  export type BatchactionsRecordUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BatchactionsRecord
     */
    select?: BatchactionsRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BatchactionsRecord
     */
    omit?: BatchactionsRecordOmit<ExtArgs> | null
    /**
     * The filter to search for the BatchactionsRecord to update in case it exists.
     */
    where: BatchactionsRecordWhereUniqueInput
    /**
     * In case the BatchactionsRecord found by the `where` argument doesn't exist, create a new BatchactionsRecord with this data.
     */
    create: XOR<BatchactionsRecordCreateInput, BatchactionsRecordUncheckedCreateInput>
    /**
     * In case the BatchactionsRecord was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BatchactionsRecordUpdateInput, BatchactionsRecordUncheckedUpdateInput>
  }

  /**
   * BatchactionsRecord delete
   */
  export type BatchactionsRecordDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BatchactionsRecord
     */
    select?: BatchactionsRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BatchactionsRecord
     */
    omit?: BatchactionsRecordOmit<ExtArgs> | null
    /**
     * Filter which BatchactionsRecord to delete.
     */
    where: BatchactionsRecordWhereUniqueInput
  }

  /**
   * BatchactionsRecord deleteMany
   */
  export type BatchactionsRecordDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BatchactionsRecords to delete
     */
    where?: BatchactionsRecordWhereInput
    /**
     * Limit how many BatchactionsRecords to delete.
     */
    limit?: number
  }

  /**
   * BatchactionsRecord without action
   */
  export type BatchactionsRecordDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BatchactionsRecord
     */
    select?: BatchactionsRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BatchactionsRecord
     */
    omit?: BatchactionsRecordOmit<ExtArgs> | null
  }


  /**
   * Model BatchactionsBatch
   */

  export type AggregateBatchactionsBatch = {
    _count: BatchactionsBatchCountAggregateOutputType | null
    _avg: BatchactionsBatchAvgAggregateOutputType | null
    _sum: BatchactionsBatchSumAggregateOutputType | null
    _min: BatchactionsBatchMinAggregateOutputType | null
    _max: BatchactionsBatchMaxAggregateOutputType | null
  }

  export type BatchactionsBatchAvgAggregateOutputType = {
    batchIndex: number | null
    claimedAt: number | null
    recordStartIndex: number | null
    recordEndIndex: number | null
    processedCount: number | null
    failedCount: number | null
    version: number | null
  }

  export type BatchactionsBatchSumAggregateOutputType = {
    batchIndex: number | null
    claimedAt: bigint | null
    recordStartIndex: number | null
    recordEndIndex: number | null
    processedCount: number | null
    failedCount: number | null
    version: number | null
  }

  export type BatchactionsBatchMinAggregateOutputType = {
    id: string | null
    jobId: string | null
    batchIndex: number | null
    status: string | null
    workerId: string | null
    claimedAt: bigint | null
    recordStartIndex: number | null
    recordEndIndex: number | null
    processedCount: number | null
    failedCount: number | null
    version: number | null
  }

  export type BatchactionsBatchMaxAggregateOutputType = {
    id: string | null
    jobId: string | null
    batchIndex: number | null
    status: string | null
    workerId: string | null
    claimedAt: bigint | null
    recordStartIndex: number | null
    recordEndIndex: number | null
    processedCount: number | null
    failedCount: number | null
    version: number | null
  }

  export type BatchactionsBatchCountAggregateOutputType = {
    id: number
    jobId: number
    batchIndex: number
    status: number
    workerId: number
    claimedAt: number
    recordStartIndex: number
    recordEndIndex: number
    processedCount: number
    failedCount: number
    version: number
    _all: number
  }


  export type BatchactionsBatchAvgAggregateInputType = {
    batchIndex?: true
    claimedAt?: true
    recordStartIndex?: true
    recordEndIndex?: true
    processedCount?: true
    failedCount?: true
    version?: true
  }

  export type BatchactionsBatchSumAggregateInputType = {
    batchIndex?: true
    claimedAt?: true
    recordStartIndex?: true
    recordEndIndex?: true
    processedCount?: true
    failedCount?: true
    version?: true
  }

  export type BatchactionsBatchMinAggregateInputType = {
    id?: true
    jobId?: true
    batchIndex?: true
    status?: true
    workerId?: true
    claimedAt?: true
    recordStartIndex?: true
    recordEndIndex?: true
    processedCount?: true
    failedCount?: true
    version?: true
  }

  export type BatchactionsBatchMaxAggregateInputType = {
    id?: true
    jobId?: true
    batchIndex?: true
    status?: true
    workerId?: true
    claimedAt?: true
    recordStartIndex?: true
    recordEndIndex?: true
    processedCount?: true
    failedCount?: true
    version?: true
  }

  export type BatchactionsBatchCountAggregateInputType = {
    id?: true
    jobId?: true
    batchIndex?: true
    status?: true
    workerId?: true
    claimedAt?: true
    recordStartIndex?: true
    recordEndIndex?: true
    processedCount?: true
    failedCount?: true
    version?: true
    _all?: true
  }

  export type BatchactionsBatchAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BatchactionsBatch to aggregate.
     */
    where?: BatchactionsBatchWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BatchactionsBatches to fetch.
     */
    orderBy?: BatchactionsBatchOrderByWithRelationInput | BatchactionsBatchOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BatchactionsBatchWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BatchactionsBatches from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BatchactionsBatches.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned BatchactionsBatches
    **/
    _count?: true | BatchactionsBatchCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: BatchactionsBatchAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: BatchactionsBatchSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BatchactionsBatchMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BatchactionsBatchMaxAggregateInputType
  }

  export type GetBatchactionsBatchAggregateType<T extends BatchactionsBatchAggregateArgs> = {
        [P in keyof T & keyof AggregateBatchactionsBatch]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBatchactionsBatch[P]>
      : GetScalarType<T[P], AggregateBatchactionsBatch[P]>
  }




  export type BatchactionsBatchGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BatchactionsBatchWhereInput
    orderBy?: BatchactionsBatchOrderByWithAggregationInput | BatchactionsBatchOrderByWithAggregationInput[]
    by: BatchactionsBatchScalarFieldEnum[] | BatchactionsBatchScalarFieldEnum
    having?: BatchactionsBatchScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BatchactionsBatchCountAggregateInputType | true
    _avg?: BatchactionsBatchAvgAggregateInputType
    _sum?: BatchactionsBatchSumAggregateInputType
    _min?: BatchactionsBatchMinAggregateInputType
    _max?: BatchactionsBatchMaxAggregateInputType
  }

  export type BatchactionsBatchGroupByOutputType = {
    id: string
    jobId: string
    batchIndex: number
    status: string
    workerId: string | null
    claimedAt: bigint | null
    recordStartIndex: number
    recordEndIndex: number
    processedCount: number
    failedCount: number
    version: number
    _count: BatchactionsBatchCountAggregateOutputType | null
    _avg: BatchactionsBatchAvgAggregateOutputType | null
    _sum: BatchactionsBatchSumAggregateOutputType | null
    _min: BatchactionsBatchMinAggregateOutputType | null
    _max: BatchactionsBatchMaxAggregateOutputType | null
  }

  type GetBatchactionsBatchGroupByPayload<T extends BatchactionsBatchGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BatchactionsBatchGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BatchactionsBatchGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BatchactionsBatchGroupByOutputType[P]>
            : GetScalarType<T[P], BatchactionsBatchGroupByOutputType[P]>
        }
      >
    >


  export type BatchactionsBatchSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    jobId?: boolean
    batchIndex?: boolean
    status?: boolean
    workerId?: boolean
    claimedAt?: boolean
    recordStartIndex?: boolean
    recordEndIndex?: boolean
    processedCount?: boolean
    failedCount?: boolean
    version?: boolean
  }, ExtArgs["result"]["batchactionsBatch"]>

  export type BatchactionsBatchSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    jobId?: boolean
    batchIndex?: boolean
    status?: boolean
    workerId?: boolean
    claimedAt?: boolean
    recordStartIndex?: boolean
    recordEndIndex?: boolean
    processedCount?: boolean
    failedCount?: boolean
    version?: boolean
  }, ExtArgs["result"]["batchactionsBatch"]>

  export type BatchactionsBatchSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    jobId?: boolean
    batchIndex?: boolean
    status?: boolean
    workerId?: boolean
    claimedAt?: boolean
    recordStartIndex?: boolean
    recordEndIndex?: boolean
    processedCount?: boolean
    failedCount?: boolean
    version?: boolean
  }, ExtArgs["result"]["batchactionsBatch"]>

  export type BatchactionsBatchSelectScalar = {
    id?: boolean
    jobId?: boolean
    batchIndex?: boolean
    status?: boolean
    workerId?: boolean
    claimedAt?: boolean
    recordStartIndex?: boolean
    recordEndIndex?: boolean
    processedCount?: boolean
    failedCount?: boolean
    version?: boolean
  }

  export type BatchactionsBatchOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "jobId" | "batchIndex" | "status" | "workerId" | "claimedAt" | "recordStartIndex" | "recordEndIndex" | "processedCount" | "failedCount" | "version", ExtArgs["result"]["batchactionsBatch"]>

  export type $BatchactionsBatchPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "BatchactionsBatch"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      jobId: string
      batchIndex: number
      status: string
      workerId: string | null
      claimedAt: bigint | null
      recordStartIndex: number
      recordEndIndex: number
      processedCount: number
      failedCount: number
      version: number
    }, ExtArgs["result"]["batchactionsBatch"]>
    composites: {}
  }

  type BatchactionsBatchGetPayload<S extends boolean | null | undefined | BatchactionsBatchDefaultArgs> = $Result.GetResult<Prisma.$BatchactionsBatchPayload, S>

  type BatchactionsBatchCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<BatchactionsBatchFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: BatchactionsBatchCountAggregateInputType | true
    }

  export interface BatchactionsBatchDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['BatchactionsBatch'], meta: { name: 'BatchactionsBatch' } }
    /**
     * Find zero or one BatchactionsBatch that matches the filter.
     * @param {BatchactionsBatchFindUniqueArgs} args - Arguments to find a BatchactionsBatch
     * @example
     * // Get one BatchactionsBatch
     * const batchactionsBatch = await prisma.batchactionsBatch.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BatchactionsBatchFindUniqueArgs>(args: SelectSubset<T, BatchactionsBatchFindUniqueArgs<ExtArgs>>): Prisma__BatchactionsBatchClient<$Result.GetResult<Prisma.$BatchactionsBatchPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one BatchactionsBatch that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {BatchactionsBatchFindUniqueOrThrowArgs} args - Arguments to find a BatchactionsBatch
     * @example
     * // Get one BatchactionsBatch
     * const batchactionsBatch = await prisma.batchactionsBatch.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BatchactionsBatchFindUniqueOrThrowArgs>(args: SelectSubset<T, BatchactionsBatchFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BatchactionsBatchClient<$Result.GetResult<Prisma.$BatchactionsBatchPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first BatchactionsBatch that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BatchactionsBatchFindFirstArgs} args - Arguments to find a BatchactionsBatch
     * @example
     * // Get one BatchactionsBatch
     * const batchactionsBatch = await prisma.batchactionsBatch.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BatchactionsBatchFindFirstArgs>(args?: SelectSubset<T, BatchactionsBatchFindFirstArgs<ExtArgs>>): Prisma__BatchactionsBatchClient<$Result.GetResult<Prisma.$BatchactionsBatchPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first BatchactionsBatch that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BatchactionsBatchFindFirstOrThrowArgs} args - Arguments to find a BatchactionsBatch
     * @example
     * // Get one BatchactionsBatch
     * const batchactionsBatch = await prisma.batchactionsBatch.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BatchactionsBatchFindFirstOrThrowArgs>(args?: SelectSubset<T, BatchactionsBatchFindFirstOrThrowArgs<ExtArgs>>): Prisma__BatchactionsBatchClient<$Result.GetResult<Prisma.$BatchactionsBatchPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more BatchactionsBatches that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BatchactionsBatchFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all BatchactionsBatches
     * const batchactionsBatches = await prisma.batchactionsBatch.findMany()
     * 
     * // Get first 10 BatchactionsBatches
     * const batchactionsBatches = await prisma.batchactionsBatch.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const batchactionsBatchWithIdOnly = await prisma.batchactionsBatch.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends BatchactionsBatchFindManyArgs>(args?: SelectSubset<T, BatchactionsBatchFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BatchactionsBatchPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a BatchactionsBatch.
     * @param {BatchactionsBatchCreateArgs} args - Arguments to create a BatchactionsBatch.
     * @example
     * // Create one BatchactionsBatch
     * const BatchactionsBatch = await prisma.batchactionsBatch.create({
     *   data: {
     *     // ... data to create a BatchactionsBatch
     *   }
     * })
     * 
     */
    create<T extends BatchactionsBatchCreateArgs>(args: SelectSubset<T, BatchactionsBatchCreateArgs<ExtArgs>>): Prisma__BatchactionsBatchClient<$Result.GetResult<Prisma.$BatchactionsBatchPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many BatchactionsBatches.
     * @param {BatchactionsBatchCreateManyArgs} args - Arguments to create many BatchactionsBatches.
     * @example
     * // Create many BatchactionsBatches
     * const batchactionsBatch = await prisma.batchactionsBatch.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BatchactionsBatchCreateManyArgs>(args?: SelectSubset<T, BatchactionsBatchCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many BatchactionsBatches and returns the data saved in the database.
     * @param {BatchactionsBatchCreateManyAndReturnArgs} args - Arguments to create many BatchactionsBatches.
     * @example
     * // Create many BatchactionsBatches
     * const batchactionsBatch = await prisma.batchactionsBatch.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many BatchactionsBatches and only return the `id`
     * const batchactionsBatchWithIdOnly = await prisma.batchactionsBatch.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends BatchactionsBatchCreateManyAndReturnArgs>(args?: SelectSubset<T, BatchactionsBatchCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BatchactionsBatchPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a BatchactionsBatch.
     * @param {BatchactionsBatchDeleteArgs} args - Arguments to delete one BatchactionsBatch.
     * @example
     * // Delete one BatchactionsBatch
     * const BatchactionsBatch = await prisma.batchactionsBatch.delete({
     *   where: {
     *     // ... filter to delete one BatchactionsBatch
     *   }
     * })
     * 
     */
    delete<T extends BatchactionsBatchDeleteArgs>(args: SelectSubset<T, BatchactionsBatchDeleteArgs<ExtArgs>>): Prisma__BatchactionsBatchClient<$Result.GetResult<Prisma.$BatchactionsBatchPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one BatchactionsBatch.
     * @param {BatchactionsBatchUpdateArgs} args - Arguments to update one BatchactionsBatch.
     * @example
     * // Update one BatchactionsBatch
     * const batchactionsBatch = await prisma.batchactionsBatch.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BatchactionsBatchUpdateArgs>(args: SelectSubset<T, BatchactionsBatchUpdateArgs<ExtArgs>>): Prisma__BatchactionsBatchClient<$Result.GetResult<Prisma.$BatchactionsBatchPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more BatchactionsBatches.
     * @param {BatchactionsBatchDeleteManyArgs} args - Arguments to filter BatchactionsBatches to delete.
     * @example
     * // Delete a few BatchactionsBatches
     * const { count } = await prisma.batchactionsBatch.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BatchactionsBatchDeleteManyArgs>(args?: SelectSubset<T, BatchactionsBatchDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more BatchactionsBatches.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BatchactionsBatchUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many BatchactionsBatches
     * const batchactionsBatch = await prisma.batchactionsBatch.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BatchactionsBatchUpdateManyArgs>(args: SelectSubset<T, BatchactionsBatchUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more BatchactionsBatches and returns the data updated in the database.
     * @param {BatchactionsBatchUpdateManyAndReturnArgs} args - Arguments to update many BatchactionsBatches.
     * @example
     * // Update many BatchactionsBatches
     * const batchactionsBatch = await prisma.batchactionsBatch.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more BatchactionsBatches and only return the `id`
     * const batchactionsBatchWithIdOnly = await prisma.batchactionsBatch.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends BatchactionsBatchUpdateManyAndReturnArgs>(args: SelectSubset<T, BatchactionsBatchUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BatchactionsBatchPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one BatchactionsBatch.
     * @param {BatchactionsBatchUpsertArgs} args - Arguments to update or create a BatchactionsBatch.
     * @example
     * // Update or create a BatchactionsBatch
     * const batchactionsBatch = await prisma.batchactionsBatch.upsert({
     *   create: {
     *     // ... data to create a BatchactionsBatch
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the BatchactionsBatch we want to update
     *   }
     * })
     */
    upsert<T extends BatchactionsBatchUpsertArgs>(args: SelectSubset<T, BatchactionsBatchUpsertArgs<ExtArgs>>): Prisma__BatchactionsBatchClient<$Result.GetResult<Prisma.$BatchactionsBatchPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of BatchactionsBatches.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BatchactionsBatchCountArgs} args - Arguments to filter BatchactionsBatches to count.
     * @example
     * // Count the number of BatchactionsBatches
     * const count = await prisma.batchactionsBatch.count({
     *   where: {
     *     // ... the filter for the BatchactionsBatches we want to count
     *   }
     * })
    **/
    count<T extends BatchactionsBatchCountArgs>(
      args?: Subset<T, BatchactionsBatchCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BatchactionsBatchCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a BatchactionsBatch.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BatchactionsBatchAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends BatchactionsBatchAggregateArgs>(args: Subset<T, BatchactionsBatchAggregateArgs>): Prisma.PrismaPromise<GetBatchactionsBatchAggregateType<T>>

    /**
     * Group by BatchactionsBatch.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BatchactionsBatchGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends BatchactionsBatchGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BatchactionsBatchGroupByArgs['orderBy'] }
        : { orderBy?: BatchactionsBatchGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, BatchactionsBatchGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBatchactionsBatchGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the BatchactionsBatch model
   */
  readonly fields: BatchactionsBatchFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for BatchactionsBatch.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BatchactionsBatchClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the BatchactionsBatch model
   */
  interface BatchactionsBatchFieldRefs {
    readonly id: FieldRef<"BatchactionsBatch", 'String'>
    readonly jobId: FieldRef<"BatchactionsBatch", 'String'>
    readonly batchIndex: FieldRef<"BatchactionsBatch", 'Int'>
    readonly status: FieldRef<"BatchactionsBatch", 'String'>
    readonly workerId: FieldRef<"BatchactionsBatch", 'String'>
    readonly claimedAt: FieldRef<"BatchactionsBatch", 'BigInt'>
    readonly recordStartIndex: FieldRef<"BatchactionsBatch", 'Int'>
    readonly recordEndIndex: FieldRef<"BatchactionsBatch", 'Int'>
    readonly processedCount: FieldRef<"BatchactionsBatch", 'Int'>
    readonly failedCount: FieldRef<"BatchactionsBatch", 'Int'>
    readonly version: FieldRef<"BatchactionsBatch", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * BatchactionsBatch findUnique
   */
  export type BatchactionsBatchFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BatchactionsBatch
     */
    select?: BatchactionsBatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BatchactionsBatch
     */
    omit?: BatchactionsBatchOmit<ExtArgs> | null
    /**
     * Filter, which BatchactionsBatch to fetch.
     */
    where: BatchactionsBatchWhereUniqueInput
  }

  /**
   * BatchactionsBatch findUniqueOrThrow
   */
  export type BatchactionsBatchFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BatchactionsBatch
     */
    select?: BatchactionsBatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BatchactionsBatch
     */
    omit?: BatchactionsBatchOmit<ExtArgs> | null
    /**
     * Filter, which BatchactionsBatch to fetch.
     */
    where: BatchactionsBatchWhereUniqueInput
  }

  /**
   * BatchactionsBatch findFirst
   */
  export type BatchactionsBatchFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BatchactionsBatch
     */
    select?: BatchactionsBatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BatchactionsBatch
     */
    omit?: BatchactionsBatchOmit<ExtArgs> | null
    /**
     * Filter, which BatchactionsBatch to fetch.
     */
    where?: BatchactionsBatchWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BatchactionsBatches to fetch.
     */
    orderBy?: BatchactionsBatchOrderByWithRelationInput | BatchactionsBatchOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BatchactionsBatches.
     */
    cursor?: BatchactionsBatchWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BatchactionsBatches from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BatchactionsBatches.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BatchactionsBatches.
     */
    distinct?: BatchactionsBatchScalarFieldEnum | BatchactionsBatchScalarFieldEnum[]
  }

  /**
   * BatchactionsBatch findFirstOrThrow
   */
  export type BatchactionsBatchFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BatchactionsBatch
     */
    select?: BatchactionsBatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BatchactionsBatch
     */
    omit?: BatchactionsBatchOmit<ExtArgs> | null
    /**
     * Filter, which BatchactionsBatch to fetch.
     */
    where?: BatchactionsBatchWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BatchactionsBatches to fetch.
     */
    orderBy?: BatchactionsBatchOrderByWithRelationInput | BatchactionsBatchOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BatchactionsBatches.
     */
    cursor?: BatchactionsBatchWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BatchactionsBatches from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BatchactionsBatches.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BatchactionsBatches.
     */
    distinct?: BatchactionsBatchScalarFieldEnum | BatchactionsBatchScalarFieldEnum[]
  }

  /**
   * BatchactionsBatch findMany
   */
  export type BatchactionsBatchFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BatchactionsBatch
     */
    select?: BatchactionsBatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BatchactionsBatch
     */
    omit?: BatchactionsBatchOmit<ExtArgs> | null
    /**
     * Filter, which BatchactionsBatches to fetch.
     */
    where?: BatchactionsBatchWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BatchactionsBatches to fetch.
     */
    orderBy?: BatchactionsBatchOrderByWithRelationInput | BatchactionsBatchOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing BatchactionsBatches.
     */
    cursor?: BatchactionsBatchWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BatchactionsBatches from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BatchactionsBatches.
     */
    skip?: number
    distinct?: BatchactionsBatchScalarFieldEnum | BatchactionsBatchScalarFieldEnum[]
  }

  /**
   * BatchactionsBatch create
   */
  export type BatchactionsBatchCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BatchactionsBatch
     */
    select?: BatchactionsBatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BatchactionsBatch
     */
    omit?: BatchactionsBatchOmit<ExtArgs> | null
    /**
     * The data needed to create a BatchactionsBatch.
     */
    data: XOR<BatchactionsBatchCreateInput, BatchactionsBatchUncheckedCreateInput>
  }

  /**
   * BatchactionsBatch createMany
   */
  export type BatchactionsBatchCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many BatchactionsBatches.
     */
    data: BatchactionsBatchCreateManyInput | BatchactionsBatchCreateManyInput[]
  }

  /**
   * BatchactionsBatch createManyAndReturn
   */
  export type BatchactionsBatchCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BatchactionsBatch
     */
    select?: BatchactionsBatchSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the BatchactionsBatch
     */
    omit?: BatchactionsBatchOmit<ExtArgs> | null
    /**
     * The data used to create many BatchactionsBatches.
     */
    data: BatchactionsBatchCreateManyInput | BatchactionsBatchCreateManyInput[]
  }

  /**
   * BatchactionsBatch update
   */
  export type BatchactionsBatchUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BatchactionsBatch
     */
    select?: BatchactionsBatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BatchactionsBatch
     */
    omit?: BatchactionsBatchOmit<ExtArgs> | null
    /**
     * The data needed to update a BatchactionsBatch.
     */
    data: XOR<BatchactionsBatchUpdateInput, BatchactionsBatchUncheckedUpdateInput>
    /**
     * Choose, which BatchactionsBatch to update.
     */
    where: BatchactionsBatchWhereUniqueInput
  }

  /**
   * BatchactionsBatch updateMany
   */
  export type BatchactionsBatchUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update BatchactionsBatches.
     */
    data: XOR<BatchactionsBatchUpdateManyMutationInput, BatchactionsBatchUncheckedUpdateManyInput>
    /**
     * Filter which BatchactionsBatches to update
     */
    where?: BatchactionsBatchWhereInput
    /**
     * Limit how many BatchactionsBatches to update.
     */
    limit?: number
  }

  /**
   * BatchactionsBatch updateManyAndReturn
   */
  export type BatchactionsBatchUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BatchactionsBatch
     */
    select?: BatchactionsBatchSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the BatchactionsBatch
     */
    omit?: BatchactionsBatchOmit<ExtArgs> | null
    /**
     * The data used to update BatchactionsBatches.
     */
    data: XOR<BatchactionsBatchUpdateManyMutationInput, BatchactionsBatchUncheckedUpdateManyInput>
    /**
     * Filter which BatchactionsBatches to update
     */
    where?: BatchactionsBatchWhereInput
    /**
     * Limit how many BatchactionsBatches to update.
     */
    limit?: number
  }

  /**
   * BatchactionsBatch upsert
   */
  export type BatchactionsBatchUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BatchactionsBatch
     */
    select?: BatchactionsBatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BatchactionsBatch
     */
    omit?: BatchactionsBatchOmit<ExtArgs> | null
    /**
     * The filter to search for the BatchactionsBatch to update in case it exists.
     */
    where: BatchactionsBatchWhereUniqueInput
    /**
     * In case the BatchactionsBatch found by the `where` argument doesn't exist, create a new BatchactionsBatch with this data.
     */
    create: XOR<BatchactionsBatchCreateInput, BatchactionsBatchUncheckedCreateInput>
    /**
     * In case the BatchactionsBatch was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BatchactionsBatchUpdateInput, BatchactionsBatchUncheckedUpdateInput>
  }

  /**
   * BatchactionsBatch delete
   */
  export type BatchactionsBatchDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BatchactionsBatch
     */
    select?: BatchactionsBatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BatchactionsBatch
     */
    omit?: BatchactionsBatchOmit<ExtArgs> | null
    /**
     * Filter which BatchactionsBatch to delete.
     */
    where: BatchactionsBatchWhereUniqueInput
  }

  /**
   * BatchactionsBatch deleteMany
   */
  export type BatchactionsBatchDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BatchactionsBatches to delete
     */
    where?: BatchactionsBatchWhereInput
    /**
     * Limit how many BatchactionsBatches to delete.
     */
    limit?: number
  }

  /**
   * BatchactionsBatch without action
   */
  export type BatchactionsBatchDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BatchactionsBatch
     */
    select?: BatchactionsBatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BatchactionsBatch
     */
    omit?: BatchactionsBatchOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const BatchactionsJobScalarFieldEnum: {
    id: 'id',
    status: 'status',
    config: 'config',
    batches: 'batches',
    totalRecords: 'totalRecords',
    startedAt: 'startedAt',
    completedAt: 'completedAt',
    distributed: 'distributed'
  };

  export type BatchactionsJobScalarFieldEnum = (typeof BatchactionsJobScalarFieldEnum)[keyof typeof BatchactionsJobScalarFieldEnum]


  export const BatchactionsRecordScalarFieldEnum: {
    id: 'id',
    jobId: 'jobId',
    batchId: 'batchId',
    recordIndex: 'recordIndex',
    status: 'status',
    raw: 'raw',
    parsed: 'parsed',
    errors: 'errors',
    processingError: 'processingError'
  };

  export type BatchactionsRecordScalarFieldEnum = (typeof BatchactionsRecordScalarFieldEnum)[keyof typeof BatchactionsRecordScalarFieldEnum]


  export const BatchactionsBatchScalarFieldEnum: {
    id: 'id',
    jobId: 'jobId',
    batchIndex: 'batchIndex',
    status: 'status',
    workerId: 'workerId',
    claimedAt: 'claimedAt',
    recordStartIndex: 'recordStartIndex',
    recordEndIndex: 'recordEndIndex',
    processedCount: 'processedCount',
    failedCount: 'failedCount',
    version: 'version'
  };

  export type BatchactionsBatchScalarFieldEnum = (typeof BatchactionsBatchScalarFieldEnum)[keyof typeof BatchactionsBatchScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'BigInt'
   */
  export type BigIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BigInt'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    
  /**
   * Deep Input Types
   */


  export type BatchactionsJobWhereInput = {
    AND?: BatchactionsJobWhereInput | BatchactionsJobWhereInput[]
    OR?: BatchactionsJobWhereInput[]
    NOT?: BatchactionsJobWhereInput | BatchactionsJobWhereInput[]
    id?: StringFilter<"BatchactionsJob"> | string
    status?: StringFilter<"BatchactionsJob"> | string
    config?: StringFilter<"BatchactionsJob"> | string
    batches?: StringFilter<"BatchactionsJob"> | string
    totalRecords?: IntFilter<"BatchactionsJob"> | number
    startedAt?: BigIntNullableFilter<"BatchactionsJob"> | bigint | number | null
    completedAt?: BigIntNullableFilter<"BatchactionsJob"> | bigint | number | null
    distributed?: BoolFilter<"BatchactionsJob"> | boolean
  }

  export type BatchactionsJobOrderByWithRelationInput = {
    id?: SortOrder
    status?: SortOrder
    config?: SortOrder
    batches?: SortOrder
    totalRecords?: SortOrder
    startedAt?: SortOrderInput | SortOrder
    completedAt?: SortOrderInput | SortOrder
    distributed?: SortOrder
  }

  export type BatchactionsJobWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: BatchactionsJobWhereInput | BatchactionsJobWhereInput[]
    OR?: BatchactionsJobWhereInput[]
    NOT?: BatchactionsJobWhereInput | BatchactionsJobWhereInput[]
    status?: StringFilter<"BatchactionsJob"> | string
    config?: StringFilter<"BatchactionsJob"> | string
    batches?: StringFilter<"BatchactionsJob"> | string
    totalRecords?: IntFilter<"BatchactionsJob"> | number
    startedAt?: BigIntNullableFilter<"BatchactionsJob"> | bigint | number | null
    completedAt?: BigIntNullableFilter<"BatchactionsJob"> | bigint | number | null
    distributed?: BoolFilter<"BatchactionsJob"> | boolean
  }, "id">

  export type BatchactionsJobOrderByWithAggregationInput = {
    id?: SortOrder
    status?: SortOrder
    config?: SortOrder
    batches?: SortOrder
    totalRecords?: SortOrder
    startedAt?: SortOrderInput | SortOrder
    completedAt?: SortOrderInput | SortOrder
    distributed?: SortOrder
    _count?: BatchactionsJobCountOrderByAggregateInput
    _avg?: BatchactionsJobAvgOrderByAggregateInput
    _max?: BatchactionsJobMaxOrderByAggregateInput
    _min?: BatchactionsJobMinOrderByAggregateInput
    _sum?: BatchactionsJobSumOrderByAggregateInput
  }

  export type BatchactionsJobScalarWhereWithAggregatesInput = {
    AND?: BatchactionsJobScalarWhereWithAggregatesInput | BatchactionsJobScalarWhereWithAggregatesInput[]
    OR?: BatchactionsJobScalarWhereWithAggregatesInput[]
    NOT?: BatchactionsJobScalarWhereWithAggregatesInput | BatchactionsJobScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"BatchactionsJob"> | string
    status?: StringWithAggregatesFilter<"BatchactionsJob"> | string
    config?: StringWithAggregatesFilter<"BatchactionsJob"> | string
    batches?: StringWithAggregatesFilter<"BatchactionsJob"> | string
    totalRecords?: IntWithAggregatesFilter<"BatchactionsJob"> | number
    startedAt?: BigIntNullableWithAggregatesFilter<"BatchactionsJob"> | bigint | number | null
    completedAt?: BigIntNullableWithAggregatesFilter<"BatchactionsJob"> | bigint | number | null
    distributed?: BoolWithAggregatesFilter<"BatchactionsJob"> | boolean
  }

  export type BatchactionsRecordWhereInput = {
    AND?: BatchactionsRecordWhereInput | BatchactionsRecordWhereInput[]
    OR?: BatchactionsRecordWhereInput[]
    NOT?: BatchactionsRecordWhereInput | BatchactionsRecordWhereInput[]
    id?: IntFilter<"BatchactionsRecord"> | number
    jobId?: StringFilter<"BatchactionsRecord"> | string
    batchId?: StringFilter<"BatchactionsRecord"> | string
    recordIndex?: IntFilter<"BatchactionsRecord"> | number
    status?: StringFilter<"BatchactionsRecord"> | string
    raw?: StringFilter<"BatchactionsRecord"> | string
    parsed?: StringFilter<"BatchactionsRecord"> | string
    errors?: StringFilter<"BatchactionsRecord"> | string
    processingError?: StringNullableFilter<"BatchactionsRecord"> | string | null
  }

  export type BatchactionsRecordOrderByWithRelationInput = {
    id?: SortOrder
    jobId?: SortOrder
    batchId?: SortOrder
    recordIndex?: SortOrder
    status?: SortOrder
    raw?: SortOrder
    parsed?: SortOrder
    errors?: SortOrder
    processingError?: SortOrderInput | SortOrder
  }

  export type BatchactionsRecordWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    jobId_recordIndex?: BatchactionsRecordJobIdRecordIndexCompoundUniqueInput
    AND?: BatchactionsRecordWhereInput | BatchactionsRecordWhereInput[]
    OR?: BatchactionsRecordWhereInput[]
    NOT?: BatchactionsRecordWhereInput | BatchactionsRecordWhereInput[]
    jobId?: StringFilter<"BatchactionsRecord"> | string
    batchId?: StringFilter<"BatchactionsRecord"> | string
    recordIndex?: IntFilter<"BatchactionsRecord"> | number
    status?: StringFilter<"BatchactionsRecord"> | string
    raw?: StringFilter<"BatchactionsRecord"> | string
    parsed?: StringFilter<"BatchactionsRecord"> | string
    errors?: StringFilter<"BatchactionsRecord"> | string
    processingError?: StringNullableFilter<"BatchactionsRecord"> | string | null
  }, "id" | "jobId_recordIndex">

  export type BatchactionsRecordOrderByWithAggregationInput = {
    id?: SortOrder
    jobId?: SortOrder
    batchId?: SortOrder
    recordIndex?: SortOrder
    status?: SortOrder
    raw?: SortOrder
    parsed?: SortOrder
    errors?: SortOrder
    processingError?: SortOrderInput | SortOrder
    _count?: BatchactionsRecordCountOrderByAggregateInput
    _avg?: BatchactionsRecordAvgOrderByAggregateInput
    _max?: BatchactionsRecordMaxOrderByAggregateInput
    _min?: BatchactionsRecordMinOrderByAggregateInput
    _sum?: BatchactionsRecordSumOrderByAggregateInput
  }

  export type BatchactionsRecordScalarWhereWithAggregatesInput = {
    AND?: BatchactionsRecordScalarWhereWithAggregatesInput | BatchactionsRecordScalarWhereWithAggregatesInput[]
    OR?: BatchactionsRecordScalarWhereWithAggregatesInput[]
    NOT?: BatchactionsRecordScalarWhereWithAggregatesInput | BatchactionsRecordScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"BatchactionsRecord"> | number
    jobId?: StringWithAggregatesFilter<"BatchactionsRecord"> | string
    batchId?: StringWithAggregatesFilter<"BatchactionsRecord"> | string
    recordIndex?: IntWithAggregatesFilter<"BatchactionsRecord"> | number
    status?: StringWithAggregatesFilter<"BatchactionsRecord"> | string
    raw?: StringWithAggregatesFilter<"BatchactionsRecord"> | string
    parsed?: StringWithAggregatesFilter<"BatchactionsRecord"> | string
    errors?: StringWithAggregatesFilter<"BatchactionsRecord"> | string
    processingError?: StringNullableWithAggregatesFilter<"BatchactionsRecord"> | string | null
  }

  export type BatchactionsBatchWhereInput = {
    AND?: BatchactionsBatchWhereInput | BatchactionsBatchWhereInput[]
    OR?: BatchactionsBatchWhereInput[]
    NOT?: BatchactionsBatchWhereInput | BatchactionsBatchWhereInput[]
    id?: StringFilter<"BatchactionsBatch"> | string
    jobId?: StringFilter<"BatchactionsBatch"> | string
    batchIndex?: IntFilter<"BatchactionsBatch"> | number
    status?: StringFilter<"BatchactionsBatch"> | string
    workerId?: StringNullableFilter<"BatchactionsBatch"> | string | null
    claimedAt?: BigIntNullableFilter<"BatchactionsBatch"> | bigint | number | null
    recordStartIndex?: IntFilter<"BatchactionsBatch"> | number
    recordEndIndex?: IntFilter<"BatchactionsBatch"> | number
    processedCount?: IntFilter<"BatchactionsBatch"> | number
    failedCount?: IntFilter<"BatchactionsBatch"> | number
    version?: IntFilter<"BatchactionsBatch"> | number
  }

  export type BatchactionsBatchOrderByWithRelationInput = {
    id?: SortOrder
    jobId?: SortOrder
    batchIndex?: SortOrder
    status?: SortOrder
    workerId?: SortOrderInput | SortOrder
    claimedAt?: SortOrderInput | SortOrder
    recordStartIndex?: SortOrder
    recordEndIndex?: SortOrder
    processedCount?: SortOrder
    failedCount?: SortOrder
    version?: SortOrder
  }

  export type BatchactionsBatchWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    jobId_batchIndex?: BatchactionsBatchJobIdBatchIndexCompoundUniqueInput
    AND?: BatchactionsBatchWhereInput | BatchactionsBatchWhereInput[]
    OR?: BatchactionsBatchWhereInput[]
    NOT?: BatchactionsBatchWhereInput | BatchactionsBatchWhereInput[]
    jobId?: StringFilter<"BatchactionsBatch"> | string
    batchIndex?: IntFilter<"BatchactionsBatch"> | number
    status?: StringFilter<"BatchactionsBatch"> | string
    workerId?: StringNullableFilter<"BatchactionsBatch"> | string | null
    claimedAt?: BigIntNullableFilter<"BatchactionsBatch"> | bigint | number | null
    recordStartIndex?: IntFilter<"BatchactionsBatch"> | number
    recordEndIndex?: IntFilter<"BatchactionsBatch"> | number
    processedCount?: IntFilter<"BatchactionsBatch"> | number
    failedCount?: IntFilter<"BatchactionsBatch"> | number
    version?: IntFilter<"BatchactionsBatch"> | number
  }, "id" | "jobId_batchIndex">

  export type BatchactionsBatchOrderByWithAggregationInput = {
    id?: SortOrder
    jobId?: SortOrder
    batchIndex?: SortOrder
    status?: SortOrder
    workerId?: SortOrderInput | SortOrder
    claimedAt?: SortOrderInput | SortOrder
    recordStartIndex?: SortOrder
    recordEndIndex?: SortOrder
    processedCount?: SortOrder
    failedCount?: SortOrder
    version?: SortOrder
    _count?: BatchactionsBatchCountOrderByAggregateInput
    _avg?: BatchactionsBatchAvgOrderByAggregateInput
    _max?: BatchactionsBatchMaxOrderByAggregateInput
    _min?: BatchactionsBatchMinOrderByAggregateInput
    _sum?: BatchactionsBatchSumOrderByAggregateInput
  }

  export type BatchactionsBatchScalarWhereWithAggregatesInput = {
    AND?: BatchactionsBatchScalarWhereWithAggregatesInput | BatchactionsBatchScalarWhereWithAggregatesInput[]
    OR?: BatchactionsBatchScalarWhereWithAggregatesInput[]
    NOT?: BatchactionsBatchScalarWhereWithAggregatesInput | BatchactionsBatchScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"BatchactionsBatch"> | string
    jobId?: StringWithAggregatesFilter<"BatchactionsBatch"> | string
    batchIndex?: IntWithAggregatesFilter<"BatchactionsBatch"> | number
    status?: StringWithAggregatesFilter<"BatchactionsBatch"> | string
    workerId?: StringNullableWithAggregatesFilter<"BatchactionsBatch"> | string | null
    claimedAt?: BigIntNullableWithAggregatesFilter<"BatchactionsBatch"> | bigint | number | null
    recordStartIndex?: IntWithAggregatesFilter<"BatchactionsBatch"> | number
    recordEndIndex?: IntWithAggregatesFilter<"BatchactionsBatch"> | number
    processedCount?: IntWithAggregatesFilter<"BatchactionsBatch"> | number
    failedCount?: IntWithAggregatesFilter<"BatchactionsBatch"> | number
    version?: IntWithAggregatesFilter<"BatchactionsBatch"> | number
  }

  export type BatchactionsJobCreateInput = {
    id: string
    status: string
    config: string
    batches?: string
    totalRecords?: number
    startedAt?: bigint | number | null
    completedAt?: bigint | number | null
    distributed?: boolean
  }

  export type BatchactionsJobUncheckedCreateInput = {
    id: string
    status: string
    config: string
    batches?: string
    totalRecords?: number
    startedAt?: bigint | number | null
    completedAt?: bigint | number | null
    distributed?: boolean
  }

  export type BatchactionsJobUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    config?: StringFieldUpdateOperationsInput | string
    batches?: StringFieldUpdateOperationsInput | string
    totalRecords?: IntFieldUpdateOperationsInput | number
    startedAt?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    completedAt?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    distributed?: BoolFieldUpdateOperationsInput | boolean
  }

  export type BatchactionsJobUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    config?: StringFieldUpdateOperationsInput | string
    batches?: StringFieldUpdateOperationsInput | string
    totalRecords?: IntFieldUpdateOperationsInput | number
    startedAt?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    completedAt?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    distributed?: BoolFieldUpdateOperationsInput | boolean
  }

  export type BatchactionsJobCreateManyInput = {
    id: string
    status: string
    config: string
    batches?: string
    totalRecords?: number
    startedAt?: bigint | number | null
    completedAt?: bigint | number | null
    distributed?: boolean
  }

  export type BatchactionsJobUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    config?: StringFieldUpdateOperationsInput | string
    batches?: StringFieldUpdateOperationsInput | string
    totalRecords?: IntFieldUpdateOperationsInput | number
    startedAt?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    completedAt?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    distributed?: BoolFieldUpdateOperationsInput | boolean
  }

  export type BatchactionsJobUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    config?: StringFieldUpdateOperationsInput | string
    batches?: StringFieldUpdateOperationsInput | string
    totalRecords?: IntFieldUpdateOperationsInput | number
    startedAt?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    completedAt?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    distributed?: BoolFieldUpdateOperationsInput | boolean
  }

  export type BatchactionsRecordCreateInput = {
    jobId: string
    batchId: string
    recordIndex: number
    status: string
    raw: string
    parsed: string
    errors?: string
    processingError?: string | null
  }

  export type BatchactionsRecordUncheckedCreateInput = {
    id?: number
    jobId: string
    batchId: string
    recordIndex: number
    status: string
    raw: string
    parsed: string
    errors?: string
    processingError?: string | null
  }

  export type BatchactionsRecordUpdateInput = {
    jobId?: StringFieldUpdateOperationsInput | string
    batchId?: StringFieldUpdateOperationsInput | string
    recordIndex?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    raw?: StringFieldUpdateOperationsInput | string
    parsed?: StringFieldUpdateOperationsInput | string
    errors?: StringFieldUpdateOperationsInput | string
    processingError?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type BatchactionsRecordUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    jobId?: StringFieldUpdateOperationsInput | string
    batchId?: StringFieldUpdateOperationsInput | string
    recordIndex?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    raw?: StringFieldUpdateOperationsInput | string
    parsed?: StringFieldUpdateOperationsInput | string
    errors?: StringFieldUpdateOperationsInput | string
    processingError?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type BatchactionsRecordCreateManyInput = {
    id?: number
    jobId: string
    batchId: string
    recordIndex: number
    status: string
    raw: string
    parsed: string
    errors?: string
    processingError?: string | null
  }

  export type BatchactionsRecordUpdateManyMutationInput = {
    jobId?: StringFieldUpdateOperationsInput | string
    batchId?: StringFieldUpdateOperationsInput | string
    recordIndex?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    raw?: StringFieldUpdateOperationsInput | string
    parsed?: StringFieldUpdateOperationsInput | string
    errors?: StringFieldUpdateOperationsInput | string
    processingError?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type BatchactionsRecordUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    jobId?: StringFieldUpdateOperationsInput | string
    batchId?: StringFieldUpdateOperationsInput | string
    recordIndex?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    raw?: StringFieldUpdateOperationsInput | string
    parsed?: StringFieldUpdateOperationsInput | string
    errors?: StringFieldUpdateOperationsInput | string
    processingError?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type BatchactionsBatchCreateInput = {
    id: string
    jobId: string
    batchIndex: number
    status?: string
    workerId?: string | null
    claimedAt?: bigint | number | null
    recordStartIndex?: number
    recordEndIndex?: number
    processedCount?: number
    failedCount?: number
    version?: number
  }

  export type BatchactionsBatchUncheckedCreateInput = {
    id: string
    jobId: string
    batchIndex: number
    status?: string
    workerId?: string | null
    claimedAt?: bigint | number | null
    recordStartIndex?: number
    recordEndIndex?: number
    processedCount?: number
    failedCount?: number
    version?: number
  }

  export type BatchactionsBatchUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    jobId?: StringFieldUpdateOperationsInput | string
    batchIndex?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    workerId?: NullableStringFieldUpdateOperationsInput | string | null
    claimedAt?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    recordStartIndex?: IntFieldUpdateOperationsInput | number
    recordEndIndex?: IntFieldUpdateOperationsInput | number
    processedCount?: IntFieldUpdateOperationsInput | number
    failedCount?: IntFieldUpdateOperationsInput | number
    version?: IntFieldUpdateOperationsInput | number
  }

  export type BatchactionsBatchUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    jobId?: StringFieldUpdateOperationsInput | string
    batchIndex?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    workerId?: NullableStringFieldUpdateOperationsInput | string | null
    claimedAt?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    recordStartIndex?: IntFieldUpdateOperationsInput | number
    recordEndIndex?: IntFieldUpdateOperationsInput | number
    processedCount?: IntFieldUpdateOperationsInput | number
    failedCount?: IntFieldUpdateOperationsInput | number
    version?: IntFieldUpdateOperationsInput | number
  }

  export type BatchactionsBatchCreateManyInput = {
    id: string
    jobId: string
    batchIndex: number
    status?: string
    workerId?: string | null
    claimedAt?: bigint | number | null
    recordStartIndex?: number
    recordEndIndex?: number
    processedCount?: number
    failedCount?: number
    version?: number
  }

  export type BatchactionsBatchUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    jobId?: StringFieldUpdateOperationsInput | string
    batchIndex?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    workerId?: NullableStringFieldUpdateOperationsInput | string | null
    claimedAt?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    recordStartIndex?: IntFieldUpdateOperationsInput | number
    recordEndIndex?: IntFieldUpdateOperationsInput | number
    processedCount?: IntFieldUpdateOperationsInput | number
    failedCount?: IntFieldUpdateOperationsInput | number
    version?: IntFieldUpdateOperationsInput | number
  }

  export type BatchactionsBatchUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    jobId?: StringFieldUpdateOperationsInput | string
    batchIndex?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    workerId?: NullableStringFieldUpdateOperationsInput | string | null
    claimedAt?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    recordStartIndex?: IntFieldUpdateOperationsInput | number
    recordEndIndex?: IntFieldUpdateOperationsInput | number
    processedCount?: IntFieldUpdateOperationsInput | number
    failedCount?: IntFieldUpdateOperationsInput | number
    version?: IntFieldUpdateOperationsInput | number
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type BigIntNullableFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel> | null
    in?: bigint[] | number[] | null
    notIn?: bigint[] | number[] | null
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntNullableFilter<$PrismaModel> | bigint | number | null
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type BatchactionsJobCountOrderByAggregateInput = {
    id?: SortOrder
    status?: SortOrder
    config?: SortOrder
    batches?: SortOrder
    totalRecords?: SortOrder
    startedAt?: SortOrder
    completedAt?: SortOrder
    distributed?: SortOrder
  }

  export type BatchactionsJobAvgOrderByAggregateInput = {
    totalRecords?: SortOrder
    startedAt?: SortOrder
    completedAt?: SortOrder
  }

  export type BatchactionsJobMaxOrderByAggregateInput = {
    id?: SortOrder
    status?: SortOrder
    config?: SortOrder
    batches?: SortOrder
    totalRecords?: SortOrder
    startedAt?: SortOrder
    completedAt?: SortOrder
    distributed?: SortOrder
  }

  export type BatchactionsJobMinOrderByAggregateInput = {
    id?: SortOrder
    status?: SortOrder
    config?: SortOrder
    batches?: SortOrder
    totalRecords?: SortOrder
    startedAt?: SortOrder
    completedAt?: SortOrder
    distributed?: SortOrder
  }

  export type BatchactionsJobSumOrderByAggregateInput = {
    totalRecords?: SortOrder
    startedAt?: SortOrder
    completedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type BigIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel> | null
    in?: bigint[] | number[] | null
    notIn?: bigint[] | number[] | null
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntNullableWithAggregatesFilter<$PrismaModel> | bigint | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedBigIntNullableFilter<$PrismaModel>
    _min?: NestedBigIntNullableFilter<$PrismaModel>
    _max?: NestedBigIntNullableFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type BatchactionsRecordJobIdRecordIndexCompoundUniqueInput = {
    jobId: string
    recordIndex: number
  }

  export type BatchactionsRecordCountOrderByAggregateInput = {
    id?: SortOrder
    jobId?: SortOrder
    batchId?: SortOrder
    recordIndex?: SortOrder
    status?: SortOrder
    raw?: SortOrder
    parsed?: SortOrder
    errors?: SortOrder
    processingError?: SortOrder
  }

  export type BatchactionsRecordAvgOrderByAggregateInput = {
    id?: SortOrder
    recordIndex?: SortOrder
  }

  export type BatchactionsRecordMaxOrderByAggregateInput = {
    id?: SortOrder
    jobId?: SortOrder
    batchId?: SortOrder
    recordIndex?: SortOrder
    status?: SortOrder
    raw?: SortOrder
    parsed?: SortOrder
    errors?: SortOrder
    processingError?: SortOrder
  }

  export type BatchactionsRecordMinOrderByAggregateInput = {
    id?: SortOrder
    jobId?: SortOrder
    batchId?: SortOrder
    recordIndex?: SortOrder
    status?: SortOrder
    raw?: SortOrder
    parsed?: SortOrder
    errors?: SortOrder
    processingError?: SortOrder
  }

  export type BatchactionsRecordSumOrderByAggregateInput = {
    id?: SortOrder
    recordIndex?: SortOrder
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type BatchactionsBatchJobIdBatchIndexCompoundUniqueInput = {
    jobId: string
    batchIndex: number
  }

  export type BatchactionsBatchCountOrderByAggregateInput = {
    id?: SortOrder
    jobId?: SortOrder
    batchIndex?: SortOrder
    status?: SortOrder
    workerId?: SortOrder
    claimedAt?: SortOrder
    recordStartIndex?: SortOrder
    recordEndIndex?: SortOrder
    processedCount?: SortOrder
    failedCount?: SortOrder
    version?: SortOrder
  }

  export type BatchactionsBatchAvgOrderByAggregateInput = {
    batchIndex?: SortOrder
    claimedAt?: SortOrder
    recordStartIndex?: SortOrder
    recordEndIndex?: SortOrder
    processedCount?: SortOrder
    failedCount?: SortOrder
    version?: SortOrder
  }

  export type BatchactionsBatchMaxOrderByAggregateInput = {
    id?: SortOrder
    jobId?: SortOrder
    batchIndex?: SortOrder
    status?: SortOrder
    workerId?: SortOrder
    claimedAt?: SortOrder
    recordStartIndex?: SortOrder
    recordEndIndex?: SortOrder
    processedCount?: SortOrder
    failedCount?: SortOrder
    version?: SortOrder
  }

  export type BatchactionsBatchMinOrderByAggregateInput = {
    id?: SortOrder
    jobId?: SortOrder
    batchIndex?: SortOrder
    status?: SortOrder
    workerId?: SortOrder
    claimedAt?: SortOrder
    recordStartIndex?: SortOrder
    recordEndIndex?: SortOrder
    processedCount?: SortOrder
    failedCount?: SortOrder
    version?: SortOrder
  }

  export type BatchactionsBatchSumOrderByAggregateInput = {
    batchIndex?: SortOrder
    claimedAt?: SortOrder
    recordStartIndex?: SortOrder
    recordEndIndex?: SortOrder
    processedCount?: SortOrder
    failedCount?: SortOrder
    version?: SortOrder
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableBigIntFieldUpdateOperationsInput = {
    set?: bigint | number | null
    increment?: bigint | number
    decrement?: bigint | number
    multiply?: bigint | number
    divide?: bigint | number
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedBigIntNullableFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel> | null
    in?: bigint[] | number[] | null
    notIn?: bigint[] | number[] | null
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntNullableFilter<$PrismaModel> | bigint | number | null
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedBigIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel> | null
    in?: bigint[] | number[] | null
    notIn?: bigint[] | number[] | null
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntNullableWithAggregatesFilter<$PrismaModel> | bigint | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedBigIntNullableFilter<$PrismaModel>
    _min?: NestedBigIntNullableFilter<$PrismaModel>
    _max?: NestedBigIntNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}
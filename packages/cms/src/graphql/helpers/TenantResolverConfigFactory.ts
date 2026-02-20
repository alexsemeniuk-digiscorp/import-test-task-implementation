import _ from 'lodash';
import pluralize from 'pluralize';

import {
  withTenantCollectionQuery,
  withTenantCreateMutation,
  withTenantDeleteMutation,
  withTenantSingleQuery,
  withTenantUpdateMutation,
} from '../middlewares/withTenant';
import { ObjectValues } from './types';

type SingleResolverConfig = ObjectValues<Graphql.ResolverConfig>;

const QUERY_PREFIX = 'Query.';
const MUTATION_PREFIX = 'Mutation.';

const DELETE_MUTATION_KEYNAME = 'delete';
const UPDATE_MUTATION_KEYNAME = 'update';
const CREATE_MUTATION_KEYNAME = 'create';

export class TenantResolverConfigFactory {
  constructor(public readonly collectionName: string) {}

  private get collectionNamePlural() {
    return pluralize(this.collectionName);
  }

  private get capitalizedCollectionName() {
    return (
      this.collectionName.charAt(0).toUpperCase() + this.collectionName.slice(1)
    );
  }

  private get singleQueryName() {
    return QUERY_PREFIX + this.collectionName;
  }

  private get collectionQueryName() {
    return QUERY_PREFIX + this.collectionNamePlural;
  }

  private get createMutationName() {
    return (
      MUTATION_PREFIX + CREATE_MUTATION_KEYNAME + this.capitalizedCollectionName
    );
  }

  private get updateMutationName() {
    return (
      MUTATION_PREFIX + UPDATE_MUTATION_KEYNAME + this.capitalizedCollectionName
    );
  }

  private get deleteMutationName() {
    return (
      MUTATION_PREFIX + DELETE_MUTATION_KEYNAME + this.capitalizedCollectionName
    );
  }
  private buildSingleResolverConfig(
    tenantMiddleware: Graphql.MiddlewareFn,
    override: SingleResolverConfig = {},
  ): SingleResolverConfig {
    return {
      ...override,
      middlewares: [tenantMiddleware, ...(override.middlewares || [])],
    };
  }

  public buildSingleQueryConfig(override: SingleResolverConfig = {}) {
    return this.buildSingleResolverConfig(withTenantSingleQuery, override);
  }

  public buildCollectionQueryConfig(override: SingleResolverConfig = {}) {
    return this.buildSingleResolverConfig(withTenantCollectionQuery, override);
  }

  public buildCreateMutationConfig(override: SingleResolverConfig = {}) {
    return this.buildSingleResolverConfig(withTenantCreateMutation, override);
  }

  public buildUpdateMutationConfig(override: SingleResolverConfig = {}) {
    return this.buildSingleResolverConfig(withTenantUpdateMutation, override);
  }

  public buildDeleteMutationConfig(override: SingleResolverConfig = {}) {
    return this.buildSingleResolverConfig(withTenantDeleteMutation, override);
  }

  public buildResolversConfig(
    override: Graphql.ResolverConfig = {},
  ): Graphql.ResolverConfig {
    return {
      [this.singleQueryName]: this.buildSingleQueryConfig(
        override[this.singleQueryName],
      ),
      [this.collectionQueryName]: this.buildCollectionQueryConfig(
        override[this.collectionQueryName],
      ),
      [this.createMutationName]: this.buildCreateMutationConfig(
        override[this.createMutationName],
      ),
      [this.updateMutationName]: this.buildUpdateMutationConfig(
        override[this.updateMutationName],
      ),
      [this.deleteMutationName]: this.buildDeleteMutationConfig(
        override[this.deleteMutationName],
      ),
      ..._.omit(override, [
        this.singleQueryName,
        this.collectionQueryName,
        this.createMutationName,
        this.updateMutationName,
        this.deleteMutationName,
      ]),
    };
  }
}

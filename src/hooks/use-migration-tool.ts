import { isEmpty } from 'lodash';
import * as React from 'react';

import { k8sCreate } from '@console/internal/module/k8s';
import { apiVersionForModel } from '@console/internal/module/k8s/k8s';
import { RouteModel } from '@kubevirt-models';
import { RouteKind } from '@kubevirt-types';
import { useK8sWatchResource } from '@openshift-console/dynamic-plugin-sdk';

import { ForkliftControllerModel, PackageManifestModel, SubscriptionModel } from '../models';
import {
  filterMtv,
  ForkLiftKind,
  MTV_ROUTE_NAME,
  PackageManifestKind,
  resourceBuilder,
  SubscriptionsKind,
} from '../utils/migration-tool-utils';

type useMigrationResult = [
  SubscriptionsKind,
  PackageManifestKind,
  ForkLiftKind,
  string,
  () => void,
  string,
  string,
  string,
];

const useMigrationTool = (): useMigrationResult => {
  const [mtvSubscription, setMtvSubscription] = React.useState<SubscriptionsKind>();
  const [mtvOperator, setMtvOperator] = React.useState<PackageManifestKind>();
  const [mtvForkLift, setMtvForkLift] = React.useState<ForkLiftKind>();
  const [mtvUIRoute, setMtvUIRoute] = React.useState<string>();

  const [operators, isOperatorsLoaded, operatorsError] = useK8sWatchResource<PackageManifestKind[]>(
    resourceBuilder(PackageManifestModel),
  );

  const [forkLifts, isForkLiftsLoaded, forkliftsErrors] = useK8sWatchResource<ForkLiftKind[]>(
    resourceBuilder(ForkliftControllerModel),
  );

  const [subscriptions, isSubscriptionsLoaded, subscriptionsError] = useK8sWatchResource<
    SubscriptionsKind[]
  >(resourceBuilder(SubscriptionModel));

  const [routes, isRoutesLoaded, routesError] = useK8sWatchResource<RouteKind[]>(
    resourceBuilder(RouteModel, false),
  );

  React.useEffect(() => {
    isSubscriptionsLoaded &&
      isEmpty(subscriptionsError) &&
      setMtvSubscription(() => filterMtv(subscriptions));
  }, [subscriptions, isSubscriptionsLoaded, subscriptionsError]);

  React.useEffect(() => {
    isOperatorsLoaded && isEmpty(operatorsError) && setMtvOperator(() => filterMtv(operators));
  }, [operators, isOperatorsLoaded, operatorsError]);

  React.useEffect(() => {
    if (isRoutesLoaded && isEmpty(routesError)) {
      const route = routes.find(({ spec }) => spec?.to?.name === MTV_ROUTE_NAME);
      setMtvUIRoute(route ? 'https://'.concat(route?.spec?.host) : undefined);
    }
  }, [routes, isRoutesLoaded, routesError, mtvSubscription]);

  React.useEffect(() => {
    isForkLiftsLoaded &&
      isEmpty(forkliftsErrors) &&
      setMtvForkLift(() =>
        forkLifts.find(
          ({ metadata }) => metadata?.namespace === mtvSubscription?.metadata?.namespace,
        ),
      );
  }, [forkLifts, isForkLiftsLoaded, forkliftsErrors, mtvSubscription]);

  const createForkLift = async () => {
    try {
      await k8sCreate(ForkliftControllerModel, {
        kind: ForkliftControllerModel.kind,
        apiVersion: apiVersionForModel(ForkliftControllerModel),
        metadata: { name: 'forklift-controller', namespace: mtvSubscription?.metadata?.namespace },
        spec: { feature_ui: 'true', feature_validation: 'true' },
      });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
    }
  };

  return [
    mtvSubscription,
    mtvOperator,
    mtvForkLift,
    mtvUIRoute,
    createForkLift,
    subscriptionsError,
    operatorsError,
    forkliftsErrors,
  ];
};

export default useMigrationTool;

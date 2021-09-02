// tslint:disable
/**
 * KubeVirt API
 * This is KubeVirt API an add-on for Kubernetes.
 *
 * The version of the OpenAPI document: 1.0.0
 * Contact: kubevirt-dev@googlegroups.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { V1CloudInitConfigDriveSource } from './V1CloudInitConfigDriveSource';
import { V1CloudInitNoCloudSource } from './V1CloudInitNoCloudSource';
import { V1ConfigMapVolumeSource } from './V1ConfigMapVolumeSource';
import { V1ContainerDiskSource } from './V1ContainerDiskSource';
import { V1DataVolumeSource } from './V1DataVolumeSource';
import { V1EmptyDiskSource } from './V1EmptyDiskSource';
import { V1EphemeralVolumeSource } from './V1EphemeralVolumeSource';
import { V1HostDisk } from './V1HostDisk';
import { V1PersistentVolumeClaimVolumeSource } from './V1PersistentVolumeClaimVolumeSource';
import { V1SecretVolumeSource } from './V1SecretVolumeSource';
import { V1ServiceAccountVolumeSource } from './V1ServiceAccountVolumeSource';
import { V1SysprepSource } from './v1SysprepSource';

/**
 * Volume represents a named volume in a vmi.
 * @export
 * @interface V1Volume
 */
export interface V1Volume {
  /**
   *
   * @type {V1CloudInitConfigDriveSource}
   * @memberof V1Volume
   */
  cloudInitConfigDrive?: V1CloudInitConfigDriveSource;
  /**
   *
   * @type {V1CloudInitNoCloudSource}
   * @memberof V1Volume
   */
  cloudInitNoCloud?: V1CloudInitNoCloudSource;
  /**
   *
   * @type {V1ConfigMapVolumeSource}
   * @memberof V1Volume
   */
  configMap?: V1ConfigMapVolumeSource;
  /**
   *
   * @type {V1ContainerDiskSource}
   * @memberof V1Volume
   */
  containerDisk?: V1ContainerDiskSource;
  /**
   *
   * @type {V1DataVolumeSource}
   * @memberof V1Volume
   */
  dataVolume?: V1DataVolumeSource;
  /**
   *
   * @type {V1EmptyDiskSource}
   * @memberof V1Volume
   */
  emptyDisk?: V1EmptyDiskSource;
  /**
   *
   * @type {V1EphemeralVolumeSource}
   * @memberof V1Volume
   */
  ephemeral?: V1EphemeralVolumeSource;
  /**
   *
   * @type {V1HostDisk}
   * @memberof V1Volume
   */
  hostDisk?: V1HostDisk;
  /**
   * Volume\'s name. Must be a DNS_LABEL and unique within the vmi. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names
   * @type {string}
   * @memberof V1Volume
   */
  name: string;
  /**
   *
   * @type {V1PersistentVolumeClaimVolumeSource}
   * @memberof V1Volume
   */
  persistentVolumeClaim?: V1PersistentVolumeClaimVolumeSource;
  /**
   *
   * @type {V1SecretVolumeSource}
   * @memberof V1Volume
   */
  secret?: V1SecretVolumeSource;
  /**
   *
   * @type {V1ServiceAccountVolumeSource}
   * @memberof V1Volume
   */
  serviceAccount?: V1ServiceAccountVolumeSource;
  /**
   *
   * @type {V1SysprepSource}
   * @memberof V1Volume
   */
  sysprep?: V1SysprepSource;
}

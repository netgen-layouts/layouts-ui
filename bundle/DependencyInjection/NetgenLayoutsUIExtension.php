<?php

declare(strict_types=1);

namespace Netgen\Bundle\LayoutsUIBundle\DependencyInjection;

use Composer\InstalledVersions;
use Symfony\Component\Config\Resource\FileResource;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Extension\Extension;
use Symfony\Component\DependencyInjection\Extension\PrependExtensionInterface;
use Symfony\Component\Yaml\Yaml;

use function file_get_contents;
use function mb_substr;

final class NetgenLayoutsUIExtension extends Extension implements PrependExtensionInterface
{
    public function load(array $configs, ContainerBuilder $container): void {}

    public function prepend(ContainerBuilder $container): void
    {
        $container->setParameter(
            'netgen_layouts.app.asset_version',
            mb_substr(InstalledVersions::getReference('netgen/layouts-ui') ?? '', 0, 8),
        );

        $prependConfigs = [
            'framework/assets.yaml' => 'framework',
        ];

        foreach ($prependConfigs as $configFile => $prependConfig) {
            $configFile = __DIR__ . '/../Resources/config/' . $configFile;
            $config = Yaml::parse((string) file_get_contents($configFile));
            $container->prependExtensionConfig($prependConfig, $config);
            $container->addResource(new FileResource($configFile));
        }
    }
}

- [Loki Docker Driver Client](https://grafana.com/docs/loki/latest/clients/docker-driver/)
- [Configure Grafana Docker Image](https://grafana.com/docs/grafana/latest/administration/configure-docker/)
- [Configure Grafana with ENV](https://grafana.com/docs/grafana/latest/administration/configuration/#configure-with-environment-variables)
- [Guide to Loki Labels](https://grafana.com/blog/2020/08/27/the-concise-guide-to-labels-in-loki/)
- [Ad-Hoc metrics with Loki](https://www.youtube.com/watch?v=jRb20Nw4HLA)
- [Docker Prometheus Config](https://docs.docker.com/config/daemon/prometheus/)

```
curl http://localhost:3180/metrics | grep "#" > /Users/steffen/workspace/temp/docker-demo/application/metrics.txt
```


{job="qgisserver-apache"} | regexp "^(?P<value>\\d+)\\s+"
{job="qgisserver"} |= "Request finished"

sum by (job)(rate({application="demo-app"}[$__interval]))
sum by (job)(count_over_time({application="demo-app"}[$__interval]))

sum_over_time(
{job="qgisserver-apache"}
| regexp "^(?P<value>\\d+)\\s+"
| unwrap value [$__interval])

quantile_over_time(0.95,
{job="qgisserver"} |= "Request finished"
| regexp "Request finished in (?P<value>\\d+)\\s+ms"
| unwrap value [$__interval])

max_over_time(
{job="qgisserver"} |= "Request finished"
| regexp "Request finished in (?P<value>\\d+)\\s+ms"
| unwrap value [$__interval])

sum by (service) (
  count_over_time(
    {job="qgisserver-apache"} |= "SERVICE=(?P<service>\\w\\w\\w)"
    [$__interval]
)

sum (count_over_time(
  {job="qgisserver-apache"} |= "SERVICE="
  | regex "SERVICE=(?P<value>\\w\\w\\w)"
  [$__interval])
) by (value)

sum (count_over_time(
{job="qgisserver-apache"} |~ "(?i)SERVICE="
| regexp "(?i)SERVICE=(?P<service>\\w\\w\\w)"
[$__interval])
) by (service)

sum (
  count_over_time(
    {ows_service=~".+"}
    | regexp "(?P<ows_service>)"
    [$__interval]
  )
) by (ows_service) 

max_over_time(
  {job=~"qgisserver-apache"}
  | regexp "^(?P<value>\\d+)\\s"
  | unwrap value [$__interval]
) by (job)

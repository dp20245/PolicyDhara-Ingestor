"""Fetcher modules for PolicyDhara — RSS, web scrapers, and API clients."""


def __getattr__(name: str):
    if name in ("fetch_rss", "parse_rss_xml"):
        from policydhara.fetchers.rss import fetch_rss, parse_rss_xml
        return fetch_rss if name == "fetch_rss" else parse_rss_xml
    if name in ("fetch_scrape", "safe_get"):
        from policydhara.fetchers.scraper import fetch_scrape, safe_get
        return fetch_scrape if name == "fetch_scrape" else safe_get
    if name == "fetch_source":
        from policydhara.fetchers.base import fetch_source
        return fetch_source
    raise AttributeError(f"module {__name__!r} has no attribute {name!r}")


__all__ = ["fetch_rss", "parse_rss_xml", "fetch_scrape", "safe_get", "fetch_source"]

import { useLoaderData, type LoaderFunctionArgs } from "react-router";
import type { Route } from "./+types/pages.$handle";
import {defineQuery} from 'groq'
import {Query} from 'hydrogen-sanity'

const CUSTOM_PAGE_QUERY = defineQuery(`*[_type == "page" && slug.current == $slug][0] {title}`)

export const meta: Route.MetaFunction = ({ data }) => {
  return [{ title: `Hydrogen` }];
};

export async function loader(args: Route.LoaderArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return { ...deferredData, ...criticalData };
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData(
  { context, request, params }: Route.LoaderArgs,
) {
  if (!params.handle) {
    throw new Error("Missing page handle");
  }

  const initial = await context.sanity.loadQuery(CUSTOM_PAGE_QUERY, {slug: params.handle})

  if (!initial.data) {
    throw new Response("Not Found", { status: 404 });
  }

  return {initial, slug: params.handle}

}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({ context }: Route.LoaderArgs) {
  return {};
}

export default function Page({loaderData}: {loaderData: {initial: any, slug: string}}) {
  const {initial, slug} = loaderData
  return (
    <Query query={CUSTOM_PAGE_QUERY} params={{slug}} options={{initial}}>
      {(homepage, encodeDataAttribute) => (<div className="page">{JSON.stringify(homepage)}</div>)}
    </Query>
  );
}